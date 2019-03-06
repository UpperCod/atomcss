import { createCss } from "./createCss";

export let options = { prefix: "A", sheet: true, counterID: 0 };

let cache = {};

function createId() {
    return options.prefix + options.counterID++;
}

export function css(string, id) {
    id = id || createId();
    let style = document.querySelector(`style[id="${id}"]`),
        states = {};
    if (style) {
        states = JSON.parse(style.dataset.states || "{}");
    } else {
        style = document.createElement("style");
        style.id = id;
        let [rules, nextStates] = createCss(string, id);
        style.dataset.states = JSON.stringify(nextStates);
        states = nextStates;
        document.head.appendChild(style);
        if (options.sheet) {
            rules.forEach((rule, index) => {
                style.sheet.insertRule(rule, index);
            });
        } else {
            style.innerHTML = rules.join("");
        }
    }
    function getClassName(props) {
        let nextClassName = id;
        for (let key in props) {
            if (props[key] && states[key]) {
                nextClassName += " " + states[key];
            }
        }
        return nextClassName;
    }

    getClassName.toString = () => id;

    return getClassName;
}
