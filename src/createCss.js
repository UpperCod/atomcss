import { parse } from "./parse";

let currentID = 0;
let currentStates = {};

export function createCss(string, id) {
    currentID = 0;
    currentStates = {};
    let rules = toCss([["and", "." + id, parse(string)]], id);

    return [rules, currentStates];
}

function createGroup(selector, props, join = "") {
    return `${selector}{${props.join(join)}}`;
}

function toCss(data, id, parent = "", rules = []) {
    data.forEach(([type, value, children]) => {
        switch (type) {
            case "state":
                {
                    let selector = (currentStates[value] =
                            id + "_S" + currentID++),
                        scope = toCss([["and", "." + selector, children]], id);
                    rules.push(...scope);
                }
                break;
            case "import":
                rules.unshift(`@import ${value};`);
                break;
            case "media":
                {
                    let scope = toCss([["and", parent, children]], id);
                    rules.push(createGroup(`@media ${value}`, scope));
                }
                break;
            case "global":
                {
                    let scope = (scope = toCss(
                        children.map(([type, ...next]) => ["and", ...next])
                    ));
                    rules.push(...scope);
                }
                break;
            case "keyframes":
                {
                    let scope = toCss(
                            children.map(([type, ...next]) => ["and", ...next])
                        ),
                        anID = id + "_A" + currentID++;

                    rules.push(
                        createGroup(`${parent}`, [
                            `animation:${anID} ${value}`
                        ]),
                        createGroup(`@keyframes ${anID}`, scope)
                    );
                }
                break;
            case "and":
                {
                    let selector = parent + value,
                        scope = [];
                    children = children.filter(([type, value, children]) => {
                        if (type === "prop") {
                            let [all, key, val] = value.match(
                                /([\w\-]+)(?:\s*):(?:\s*)(.*)/
                            );
                            if (children.length) {
                                val = (val ? [val] : []).concat(
                                    children.map(([type, value]) => value)
                                );
                                if (key === "grid-template-areas") {
                                    val = val.map(val => `"${val}"`).join(" ");
                                }
                            }

                            scope.push(`${key}:${val}`);
                        } else {
                            return true;
                        }
                    });
                    if (scope.length) {
                        rules.push(createGroup(selector, scope, ";"));
                    }
                    toCss(children, id, selector, rules);
                }
                break;
        }
    });
    return rules;
}
