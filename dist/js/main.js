let known_automata = new Set();

function onclick_name(_event, name) {
    axios.post(`http://127.0.0.1:5000/automata/name?name=${name}`).then((response) => {
        console.log(response)
        let result = response.data.transitions;
        let states = response.data.states;
        let name = response.data.name;
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
