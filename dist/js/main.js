let known_automata = new Set();

let first_automata = '';
let second_automata = '';

let operationSelected = false;

function onclick_name(_event, name) {
    axios.post(`http://127.0.0.1:5000/automata/name?name=${name}`).then((response) => {
        console.log(response)
        let result = response.data.transitions;
        let states = response.data.states;
        let name = response.data.name;
        first_automata = name;
        known_automata.add(name);
        const getAutomataList = document.getElementById('automata-list');
        const getAllAutomata = document.getElementById('all-automata');
        getAllAutomata.innerHTML = `${name}\n<ul id="automata-list">\n${getAutomataList.innerHTML}\n</ul>`;
        drawGraph(result);
    })
}

function makeUL(element, automataList) {
    // create the list element
    // let list = document.createElement('ul');
    let list = element;

    element.innerHTML = '';

    list.setAttribute('id', 'automata-list');

    known_automata.clear();
    
    automataList.forEach((name) => {
        // create the list item element
        let item = document.createElement('li');

        // set the class to be automata
        item.setAttribute('class', 'automata');

        // set its contents
        item.appendChild(document.createTextNode(name));

        // Add it to the list
        list.appendChild(item);

        known_automata.add(name);
    });

    // return the constructed list
    // return list;
}

function onclick_get_all(_event) {
    axios.get(`http://127.0.0.1:5000/automata`).then((response) => {
        console.log(response)
        let result = response.data;
        let element = _event.target;
        let ul = document.querySelector('#automata-list');
        // if (ul) {
        //     element.removeChild(ul);
        // }
        makeUL(ul, result);
    })
}
let g = new Graph();

const drawGraph = (result) => {
    console.log(result)
    result.forEach((triplet) => {
        g.addEdge(triplet[0].toString(), triplet[2].toString(), { label: triplet[1].toString(), directed: true });
    })

    var layouter = new Graph.Layout.Spring(g);
    layouter.layout();

    var renderer = new Graph.Renderer.Raphael('canvas', g, 1200, 600);
    renderer.draw();

}

const getAllAutomata = document.getElementById('all-automata');
getAllAutomata.addEventListener('click', (e) => {
    if (e.target && !e.target.matches("li.automata"))
        onclick_get_all(e)
})

const getAutomataList = document.getElementById('automata-list');
getAutomataList.addEventListener('click', (e) => {
    if (e.target && e.target.matches("li.automata")) {
        onclick_name(e, e.target.innerText);
    }
})

const getAutomataListDisplay = document.getElementById('automata-list');
getAutomataList.addEventListener('click', (e) => {
    console.log('click works!')
    console.table(e.target);
    console.log(e.target.matches("li.automata"));
    if (e.target && e.target.matches("li.automata")) {
        console.log('second automata added');
        second_automata = e.target.innerText;
    }
})

const operationButton  = document.querySelector('.operation-button');
operationButton.addEventListener('click', (e) => {
    if (e.target) {
        e.target.setAttribute('background', '#000');
        e.target.setAttribute('text-color', '$fff');
        operationSelected = true;
        const getAllAutomataDisplay = document.querySelector('#automata-list-display');
        if (getAllAutomataDisplay.childNodes) {
            getAllAutomataDisplay.childNodes.forEach((node) => {
                getAllAutomataDisplay.removeChild(node);
            })
        }
        known_automata.forEach((name) => {
            const list_item = document.createElement('li');

            list_item.innerText = name;

            list_item.setAttribute('class', 'automata-display');

            getAllAutomataDisplay.appendChild(list_item);
        })
    }
})

const submitButtonOperation = (_event) => {
    first_automata_transition = [];
    second_automata_transition = [];
    axios.post(`http://127.0.0.1:5000/automata/name?name=${first_automata}`).then((response) => {
        console.log(response)
        first_automata_transition = response.data.transitions;
        axios.post(`http://127.0.0.1:5000/automata/name?name=${second_automata}`).then((response) => {
            console.log(response)
            second_automata_transition = response.data.transitions;
            axios.post(`http://127.0.0.1:5000/automata/multiply`, {
                'first_automata': {
                    "name": first_automata,
                    "transitions": first_automata_transition
                },
                'second_automata': {
                    "name": second_automata,
                    "transitions": second_automata_transition
                }
            }).then((response) => {
                console.log(response);
                const getAutomataList = document.getElementById('automata-list');
                const getAllAutomata = document.getElementById('all-automata');
                known_automata.add(response.data.name);
                getAllAutomata.innerHTML = `${response.data.name}\n<ul id="automata-list">\n${getAutomataList.innerHTML}\n</ul>`;
                drawGraph(response.data.transitions);
            })
        })
    })  
};

const submitButton = document.querySelector('.submit-button');
submitButton.addEventListener('click', (e) => {
    if (first_automata != '' && second_automata != '') {
        submitButtonOperation(e);
    } else {

    }
})
