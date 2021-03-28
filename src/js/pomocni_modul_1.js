export function hi() {
    document.querySelector("#img1").addEventListener("click", load);
    function load() {
        import(/* webpackChunkName: "asy" */ "./async/asy.js").then(({ default: startAsy }) => {
            console.log("Clicknuto");
            startAsy();
        }).catch((error) => "An error occurred while loading the component: ");
    }
}