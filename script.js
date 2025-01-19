function new_task(){
    const dialog=document.getElementById("new_task")
    dialog.style.display="flex"
    dialog.style.visibility="visible"
    
}
const dialog=document.getElementById("app")

dialog.addEventListener("volumechange",function myFucn(){
    alert("File Dropped");
    console.log("Hello")
})

var no_of_tasks=1
function add_task(){
    title=document.getElementById("title").value
    by=document.getElementById("by-name").value
    tag=document.getElementById("tag").value
    more_details=document.getElementById("more-details").value
    tasks=document.getElementById("tasks")
    tasks.innerHTML+=`<hr id="hr-task${no_of_tasks}">
    <div id="task${no_of_tasks}" class="task">
    <input type="checkbox" name="task${no_of_tasks}" class="checkbox">
    <div class="content">
    <p>${title}</p>
    <p id="by">By ${by}</p>
    <div id="details">
    <h2>${title}</h2>
    <span>By ${by}</span>
    <hr>
    <br>
    <p>${more_details}</p>
    </div>
    </div>
    <img src="editing.png" alt="edit" id="edit">
    <img src="WhatsApp_Image_2025-01-02_at_11.41.14_6b45f130-removebg-preview.png" alt="tick" id="tick">
    <img src="delete.png" id ="delete" alt="delete" onclick="delete_it('task${no_of_tasks}')">
    </div>`
    title=""
    by=""
    tag=""
    let colors=["Blue","Green","Red","Pink","Yellow","lightpink","black","grey","purple","cyan"]
    let randomColor=colors[Math.floor(Math.random()*colors.length)];
    console.log(no_of_tasks)
    checkbox=document.getElementById(`task${no_of_tasks}`)
    checkbox.style.setProperty("--before-background-color",randomColor);

    const dialog=document.getElementById("new_task")
    dialog.style.visibility="hidden"
    dialog.style.display="none"
    no_of_tasks+=1

}

function delete_it(id){
    element1=document.getElementById(id);
    element1.remove();
    element2=document.getElementById(`hr-${id}`);
    element2.remove();
    // tasks=document.getElementById("tasks")
    // console.log(tasks.innerHTML)
    // console.log(tasks.innerHTML.length)
    // tasks.innerHTML=tasks.innerHTML.slice(0,(tasks.innerHTML.length-4))
    // console.log(element)
}