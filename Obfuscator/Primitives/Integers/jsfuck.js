function toJSFuck(num) {
    if (num > 10) throw new Error("JSFuck numbers cannot exceed the value of 10");

    const map = {
        0: "(+[])",
        1: "(+!![])",
        2: "(!![]+!![])",
        3: "(!![]+!![]+!![])",
        4: "((!![]+[]).length)",
        5: "((![]+[]).length)",
        6: "((![]+[]).length+(!![]))",
        7: "((![]+[]).length+(!![]+!![]))",
        8: "((!![]+[]+!![]).length)",
        9: "((!![]+[]+![]).length)",
        10: "((![]+[]+![]).length)"
    };

    return map[num];
}

module.exports = { toJSFuck };