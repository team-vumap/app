function onclick(_event) {
    axios.post("http://127.0.0.1:5000/automata").then((response) => {
        console.log(response)
        let result = response.data.transitions;
        let states = response.data.states;
        drawGraph(result);
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

const eColi = document.getElementById('e-coli');
eColi.addEventListener('click', (e) => onclick(e));
