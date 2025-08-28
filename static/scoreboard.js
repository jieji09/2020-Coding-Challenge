function display_scoreboard(data, highlightId){
  if ($("#scoreboard-card").length === 0){
    const card = $(`
      <div id="scoreboard-card" class="scoreboard-card">
        <div class="scoreboard-header">
          <div class="h5 mb-0">NHL Teams</div>
          <div class="sub">Sorted by score</div>
        </div>
        <ul id="team-list" class="list-group list-group-flush"></ul>
      </div>
    `);
    $("#teams").empty().append(card);
  }

  const $list = $("#team-list");
  $list.empty();

  const sorted = data.slice().sort((a,b)=> b.score - a.score);

  sorted.forEach((team, idx)=>{
    const row = $(`
      <li class="list-group-item">
        <div class="team-row" data-id="${team.id}">
          <div class="rank-chip">${idx+1}</div>
          <div>
            <div class="team-name">${team.name}</div>
            <!-- 删除了 ID -->
          </div>
          <div class="score-badge">${team.score}</div>
          <div class="text-right">
            <button class="btn btn-primary btn-sm btn-raise" data-id="${team.id}">
              <span class="label">+1</span>
            </button>
          </div>
        </div>
      </li>
    `);
    $list.append(row);
  });  

  // 绑定按钮事件（事件委托避免重复绑定）
  $(".btn-raise").off("click").on("click", function(){
    const id = parseInt($(this).data("id"));
    increase_score(id, this);
  });

  if (highlightId != null){
    const $row = $(`.team-row[data-id="${highlightId}"]`).closest(".list-group-item");
    try{
      if (typeof $row.effect === "function"){
        $row.effect("highlight", {color:"#fff3cd"}, 800);
      }else{
        $row.addClass("flash");
        setTimeout(()=> $row.removeClass("flash"), 900);
      }
    }catch(e){
      $row.addClass("flash");
      setTimeout(()=> $row.removeClass("flash"), 900);
    }
  }
}

function addTeamView(){ }

function increase_score(id, btnEl){
  const $btn = $(btnEl);
  const $label = $btn.find(".label");

  $btn.prop("disabled", true);
  const originalText = $label.text();
  $label.text("...");

  $.ajax({
    type: "POST",
    url: "/increase_score",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({ id: id }),
    success: function(result){
      scoreboard = result.scoreboard;
      display_scoreboard(scoreboard, id);
    },
    error: function(request, status, error){
      console.log("Error");
      console.log(request, status, error);
      $label.text("Try again");
      setTimeout(()=> $label.text(originalText), 1000);
    },
    complete: function(){
      $btn.prop("disabled", false);
      $label.text(originalText);
    }
  });
}

$(document).ready(function(){
  display_scoreboard(scoreboard);
});
