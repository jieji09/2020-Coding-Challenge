from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

scoreboard = [
    {"id": 1, "name": "Boston Bruins", "score": 7},
    {"id": 2, "name": "Tampa Bay Lightning", "score": 5},
    {"id": 3, "name": "Toronto Maple Leafs", "score": 2},
    {"id": 4, "name": "Florida Panthers", "score": 1},
    {"id": 5, "name": "Buffalo Sabres", "score": 1},
]

def sort_scoreboard():
    # 就地按分数从高到低排序
    scoreboard.sort(key=lambda t: t["score"], reverse=True)

@app.route("/")
def show_scoreboard():
    # 首次渲染时也保证顺序正确
    sort_scoreboard()
    return render_template("scoreboard.html", scoreboard=scoreboard)

@app.route("/increase_score", methods=["POST"])
def increase_score():
    json_data = request.get_json(force=True)
    team_id = int(json_data["id"])

    for team in scoreboard:
        if team["id"] == team_id:
            team["score"] += 1
            break

    sort_scoreboard()
    return jsonify(scoreboard=scoreboard)

if __name__ == "__main__":
    app.run(debug=True)




