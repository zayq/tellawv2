const bubble =  document.getElementById("bubble");

document.body.onpointermove = event => {
    const { clientX, clientY } = event;

    bubble.animate(
        {
            left: `${clientX}px`,
            top: `${clientY}px`,
        }, { duration: 3000, fill: "forwards"}
    )
}