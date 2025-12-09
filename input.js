(() => {
    function tryLoad() {
        // ...
    }

    tryLoad()

    const tryLoad2 = () => {
        // ...
    }

    (function tryLoad3() {
        // ...
    })();

    tryLoad2()
})();