let processes = [];

function addProcess() {
  let pid = document.getElementById("pid").value;
  let arrival = parseInt(document.getElementById("arrival").value);
  let burst = parseInt(document.getElementById("burst").value);

  if(pid && !isNaN(arrival) && !isNaN(burst)){
    processes.push({pid, arrival, burst});
    updateTable();
  }
}

function updateTable() {
  let table = document.getElementById("processTable");
  table.innerHTML = "<tr><th>PID</th><th>Arrival</th><th>Burst</th></tr>";
  processes.forEach(p => {
    table.innerHTML += `<tr><td>${p.pid}</td><td>${p.arrival}</td><td>${p.burst}</td></tr>`;
  });
}

function runFCFS() {
  let timeline = [];
  let time = 0;
  processes.sort((a,b)=>a.arrival-b.arrival);

  processes.forEach(p => {
    if(time < p.arrival) time = p.arrival;
    timeline.push({pid:p.pid, start:time, end:time+p.burst});
    time += p.burst;
  });

  displayOutput("FCFS", timeline);
}

function runSJF() {
  let timeline = [];
  let time = 0;
  let ready = [];
  let procs = [...processes].sort((a,b)=>a.arrival-b.arrival);

  while(procs.length>0 || ready.length>0){
    while(procs.length>0 && procs[0].arrival<=time){
      ready.push(procs.shift());
    }
    if(ready.length>0){
      ready.sort((a,b)=>a.burst-b.burst);
      let p = ready.shift();
      timeline.push({pid:p.pid, start:time, end:time+p.burst});
      time += p.burst;
    } else {
      time = procs[0].arrival;
    }
  }
  displayOutput("SJF", timeline);
}

function runRR() {
  let quantum = 2;
  let timeline = [];
  let time = 0;
  let queue = [];
  let procs = processes.map(p=>({...p, remaining:p.burst}));

  while(procs.some(p=>p.remaining>0)){
    procs.forEach(p=>{
      if(p.arrival<=time && p.remaining>0 && !queue.includes(p)){
        queue.push(p);
      }
    });
    if(queue.length>0){
      let p = queue.shift();
      let exec = Math.min(quantum, p.remaining);
      timeline.push({pid:p.pid, start:time, end:time+exec});
      time += exec;
      p.remaining -= exec;
      if(p.remaining>0){
        queue.push(p);
      }
    } else {
      time++;
    }
  }
  displayOutput("Round Robin", timeline);
}

function displayOutput(algo, timeline){
  let out = document.getElementById("output");
  out.innerHTML = `<h4>${algo} Scheduling</h4>`;
  timeline.forEach(t=>{
    out.innerHTML += `Process ${t.pid}: ${t.start} → ${t.end}<br>`;
  });
  drawGantt(timeline);
}

function drawGantt(timeline){
  let canvas = document.getElementById("ganttChart");
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let x=20;
  timeline.forEach(t=>{
    let width = (t.end-t.start)*50;
    ctx.fillStyle = "#"+((1<<24)*Math.random()|0).toString(16);
    ctx.fillRect(x,80,width,60);
    ctx.fillStyle="white";
    ctx.font="14px Courier New";
    ctx.fillText(t.pid,x+width/2-10,110);
    ctx.fillText(t.start,x,150);
    ctx.fillText(t.end,x+width-20,150);
    x+=width+20;
  });
}

function drawGantt(timeline){
  let canvas = document.getElementById("ganttChart");
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);

  let x = 20;          
  let y = 50;          
  let rowHeight = 80;  

  timeline.forEach(t=>{
    let width = (t.end - t.start) * 40; 

    
    if(x + width > canvas.width - 50){
      x = 20;          
      y += rowHeight;  
    }
    
    ctx.fillStyle = "#"+((1<<24)*Math.random()|0).toString(16);
    ctx.fillRect(x, y, width, 50);

    ctx.fillStyle = "white";
    ctx.font = "14px Courier New";
    ctx.fillText(t.pid, x + width/2 - 10, y + 25);
    ctx.fillText(t.start, x, y + 70);
    ctx.fillText(t.end, x + width - 20, y + 70);

    x += width + 20; 
  });
}