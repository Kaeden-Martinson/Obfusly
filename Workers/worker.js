const { Worker } = require('worker_threads');
const path = require('path');

class WorkerPool {
    constructor(size = 10) {
        this.size = size;
        this.workers = [];
        this.queue = [];
        this.activeJobs = new Map();
        this.jobId = 0;
        
        // Initialize workers
        for (let i = 0; i < size; i++) {
            this.createWorker(i);
        }
    }
    
    createWorker(index) {
        const worker = new Worker(path.join(__dirname, '..', 'obfuscate-worker.js'));
        const workerId = `worker-${index}`;
        
        worker.on('message', (result) => {
            const jobId = result.__jobId;
            if (jobId && this.activeJobs.has(jobId)) {
                const { resolve, reject, timeout } = this.activeJobs.get(jobId);
                clearTimeout(timeout);
                this.activeJobs.delete(jobId);
                
                if (result.error) {
                    reject(new Error(result.error));
                } else {
                    resolve(result);
                }
            }
            
            // Process next job in queue
            this.processQueue(worker);
        });
        
        worker.on('error', (error) => {
            console.error(`[${workerId}] Worker error:`, error.message);
            // Find and reject all jobs for this worker
            for (const [jobId, job] of this.activeJobs.entries()) {
                if (job.worker === worker) {
                    clearTimeout(job.timeout);
                    job.reject(error);
                    this.activeJobs.delete(jobId);
                }
            }
            // Recreate the worker
            const idx = this.workers.indexOf(worker);
            if (idx !== -1) {
                this.workers[idx] = null;
                this.createWorker(idx);
            }
        });
        
        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`[${workerId}] Worker exited with code ${code}`);
                // Recreate the worker
                const idx = this.workers.indexOf(worker);
                if (idx !== -1) {
                    this.workers[idx] = null;
                    this.createWorker(idx);
                }
            }
        });
        
        this.workers[index] = worker;
    }
    
    processQueue(worker) {
        if (this.queue.length > 0) {
            const job = this.queue.shift();
            this.executeJob(worker, job);
        }
    }
    
    executeJob(worker, { code, config, resolve, reject, jobId }) {
        const timeout = setTimeout(() => {
            this.activeJobs.delete(jobId);
            reject(new Error('Obfuscation worker timeout after 30 seconds'));
        }, 30000);
        
        this.activeJobs.set(jobId, { resolve, reject, timeout, worker });
        
        // Add jobId to message so worker can send it back
        worker.postMessage({ code, config, __jobId: jobId });
    }
    
    async execute(code, config) {
        return new Promise((resolve, reject) => {
            const jobId = ++this.jobId;
            
            // Find available worker
            const availableWorker = this.workers.find(w => w && w.threadId);
            
            if (availableWorker) {
                this.executeJob(availableWorker, { code, config, resolve, reject, jobId });
            } else {
                // Queue the job if no workers available
                this.queue.push({ code, config, resolve, reject, jobId });
            }
        });
    }
    
    terminate() {
        for (const worker of this.workers) {
            if (worker) {
                worker.terminate();
            }
        }
        this.workers = [];
        this.queue = [];
        this.activeJobs.clear();
    }
}

module.exports = WorkerPool;
