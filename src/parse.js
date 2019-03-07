export function parse(template) {
    let deeps = [],
        lines = [],
        values = template.match(/[^\n\r]+/g),
        length = values.length,
        moveDeep;
    for (let i = 0; i < length; i++) {
        let value = values[i],
            deep = 0,
            line = "";
        for (let i = 0; i < value.length; i++) {
            let letter = value[i];
            if (line) {
                line += letter;
                continue;
            }
            if (/\S/.test(letter) && !line) {
                line += letter;
            } else {
                deep += /\u0009/.test(letter) ? 4 : 1;
            }
        }
        if (!line || /^\/\//.test(line)) continue;

        if (deeps.indexOf(deep) === -1) {
            let min = Math.min(...deeps),
                method = min !== Infinity && min > deep ? "unshift" : "push";
            deeps[method](deep);
        }

        deep = deeps.indexOf(deep);

        lines.push([deep, line]);
    }
    return tree(lines);
}

function tree(lines) {
    let length = lines.length,
        indexGroup = 2,
        groups = [],
        group,
        currentDeep = -1;
    for (let i = 0; i < length; i++) {
        let [deep, line] = lines[i];
        currentDeep = currentDeep < 0 ? deep : currentDeep;
        if (deep === currentDeep) {
            let [
                all,
                groupAl,
                isAl,
                valueAl,
                isAnd,
                valueAnd,
                valueEnd
            ] = line.match(/((@|::)([^\s|\(]*)){0,1}(?:(\&)(.+)){0,1}(.*)/);

            let type, value;
            if (isAl === "::") {
                type = "state";
                value = valueAl;
            } else if (isAl === "@") {
                type = valueAl;
                value = valueEnd;
            } else if (isAnd) {
                type = "and";
                value = valueAnd;
            } else {
                type = "prop";
                value = line;
            }
            groups.push((group = [type, value, []]));
        } else {
            group[indexGroup].push([deep, line]);
        }
    }
    groups = groups.map(group => {
        group[indexGroup] = tree(group[indexGroup]);
        return group;
    });
    return groups;
}
