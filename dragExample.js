const dragItem = document.getElementById("dragItem");
const dropZone = document.getElementById("dropZone");

/* fires when dragging starts */
dragItem.addEventListener("dragstart", (e) => {
    console.log("dragstart");
    dragItem.style.opacity = "0.5";

    // required for dragover/drop to work
    e.dataTransfer.setData("text/plain", "Dragged Item");
});

/* fires continuously when dragged over a valid target */
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault(); // IMPORTANT
    console.log("dragover");
    dropZone.classList.add("active");
});

/* fires when dragging ends (drop or cancel) */
dragItem.addEventListener("dragend", () => {
    console.log("dragend");
    dragItem.style.opacity = "1";
    dropZone.classList.remove("active");
});


const ul = document.getElementById("list");
const item1 = document.querySelector(".litem-1")
const item2 = document.querySelector(".litem-3")
ul.insertBefore(item2, item1);
console.log(item1);