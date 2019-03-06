export function parse(template) {
    let deeps = [],
        lines = [],
        values = template.match(/[^\n\r]+/g),
        length = values.length;
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
            let min = Math.min(...deeps);
            deep = min === Infinity ? deep : min > deep ? min : deep;
            deeps.push(deep);
        }
        deep = deeps.indexOf(deep);
        let prevLine = lines[lines.length - 1];
        if (prevLine) {
            let prevDeep = prevLine[0];
            deep = prevDeep < deep - 1 ? prevDeep + 1 : deep;
        }
        lines.push([deep, line]);
    }
    return tree(lines);
}

function tree(data) {
    let group = [],
        index = -1,
        next,
        scan = [],
        send = () => {
            group[index][2] = tree(next);
            scan.push(index);
        };
    for (let i in data) {
        let [length, line] = data[i];
        if (length === 0) {
            if (next) send();
            next = [];

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
            index = group.push([type, value.trim()]) - 1;
        } else {
            if (line) next.push([length - 1, line]);
        }
    }
    if (index > -1 && scan.indexOf(index) === -1) send();
    return group;
}
