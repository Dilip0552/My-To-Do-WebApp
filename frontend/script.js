async function fetchTodos() {
    const response = await fetch("https://my-to-do-web-app.vercel.app/todos", {
        credentials: "include" 
    });

    if (response.ok) {
        const data = await response.json();
        alert(data.message)
    } else {
        alert("Please log in first.");
        window.location.href = "index.html";  
    }
}
window.onload = fetchTodos;
function new_task(){
    const dialog=document.getElementById("new_task")
    dialog.style.display="flex"
    dialog.style.visibility="visible"
    
}

async function send_data(title,by,more_details){
    const response = await fetch("https://my-to-do-web-app.vercel.app/add_task",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({"title":title,"by":by,"more_details":more_details})
    });

    const result = await response.json();
    alert(result.message);
    console.log(result.data)

}
async function edit_task(title){
    const e_title=document.getElementById("e_title")
    const e_by=document.getElementById("e_by-name")
    const e_more_details=document.getElementById("e_more-details")
    const response = await fetch(`https://my-to-do-web-app.vercel.app/my_tasks/${title}`);
    const data = await response.json();
    // console.log(data)
    e_title.value=data.title;
    e_by.value=data.by;
    e_more_details.value=data.more_details;
    
    
    el=document.getElementById("edit-task")
    el.style.visibility="visible"



}
async function save(){
    const e_title=document.getElementById("e_title").value;
    const e_by=document.getElementById("e_by-name").value;
    const e_more_details=document.getElementById("e_more-details").value;
    dict={"title":e_title, "by":e_by,"more_details":e_more_details}
    const response = await fetch(`https://my-to-do-web-app.vercel.app/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dict)
    });
    const data = await response.json(); 
    console.log(data.message)
    alert(data.message)
    await refresh_tasks()
    el=document.getElementById("edit-task")
    el.style.visibility="hidden"
}

var no_of_tasks=1
async function add_task(){
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
    <img src="/assets/editing.png" alt="edit" id="edit" onclick="edit_task(${title})>
    <img src="/assets/WhatsApp_Image_2025-01-02_at_11.41.14_6b45f130-removebg-preview.png" alt="tick" id="tick">
    <img src="/assets/delete.png" id ="delete" alt="delete" onclick="delete_it('task${no_of_tasks}','${title}')">
    </div>`
    await send_data(title,by,more_details)
    title=""
    by=""
    tag=""
    let colors=["Blue","Green","Red","Pink","Yellow","lightpink","black","grey","purple","cyan"]
    let randomColor=colors[Math.floor(Math.random()*colors.length)];
    console.log(no_of_tasks)
    checkbox=document.getElementById(`task${no_of_tasks}`)
    checkbox.style.setProperty("--before-background-color",randomColor);
    await refresh_tasks()
    const dialog=document.getElementById("new_task")
    dialog.style.visibility="hidden"
    dialog.style.display="none"
    no_of_tasks+=1

}

async function delete_it(id,title){
    element1=document.getElementById(id);
    element1.remove();
    element2=document.getElementById(`hr-${id}`);
    element2.remove();
    const response = await fetch(`https://my-to-do-web-app.vercel.app/delete/${title}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json(); 
    console.log(data.message)
    alert(data.message)
}
function add_task_bh(dict){
    tasks=document.getElementById("tasks")
    tasks.innerHTML+=`<hr id="hr-task${no_of_tasks}">
    <div id="task${no_of_tasks}" class="task">
    <input type="checkbox" name="task${no_of_tasks}" class="checkbox">
    <div class="content">
    <p>${dict.title}</p>
    <p id="by">By ${dict.by}</p>
    <div id="details">
    <h2>${dict.title}</h2>
    <span>By ${dict.by}</span>
    <hr>
    <br>
    <p>${dict.more_details}</p>
    </div>
    </div>
    <img src="/assets/editing.png" alt="edit" id="edit" onclick="edit_task('${dict.title}')">
    <img src="/assets/WhatsApp_Image_2025-01-02_at_11.41.14_6b45f130-removebg-preview.png" alt="tick" id="tick">
    <img src="/assets/delete.png" id ="delete" alt="delete" onclick="delete_it('task${no_of_tasks}','${dict.title}')">
    </div>`
    let colors=["Blue","Green","Red","Pink","Yellow","lightpink","black","grey","purple","cyan"]
    let randomColor=colors[Math.floor(Math.random()*colors.length)];
    checkbox=document.getElementById(`task${no_of_tasks}`)
    checkbox.style.setProperty("--before-background-color",randomColor);
    no_of_tasks+=1

}

async function refresh_tasks(){
    const response = await fetch(`https://my-to-do-web-app.vercel.app/my_tasks`);
    const data = await response.json(); 
    if (data.message){
        alert(data.message)
    }
    else{
        tasks=document.getElementById("tasks")
        tasks.innerHTML=""
        data.tasks.forEach(element => {
            add_task_bh(element)
        });
    }

}
document.getElementById("refreshImg").addEventListener("click", function() {
    this.classList.toggle("rotated"); 
    refresh_tasks()
});
window.addEventListener("load", refresh_tasks());




document.getElementById("log-out-btn").addEventListener("click", () => {
    fetch('https://my-to-do-web-app.vercel.app/logout', { method: 'GET' }) 
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url; 
        }
    });
});













