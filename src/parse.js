export function parse(template) {
    let deeps = [];
    return tree(
        template
            .match(/[^\n]+/g)
            .map(value => {
                let [all, tabs, line] = value.match(/^([\s]*)(.+)/);
                length = tabs.length;
                if (deeps.indexOf(length) === -1) deeps.push(length);
                return [length, line.trim()];
            })
            .map(([length, line]) => [deeps.indexOf(length), line])
    );
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
        if (/^\/\//.test(line) || !line) continue;
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
