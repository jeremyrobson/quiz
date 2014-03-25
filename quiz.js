var quiz = [];
var stage = 0;
var checkedindex = -1;
var state = "quiz";
var audios = [];
var loading = 0;

function submit_answer() {
    checkedindex = $("#quizform input[type=radio]:checked").val();

    if (checkedindex == -1) {
        alert("Please select an answer.");
        return;
    }

    if (checkedindex == quiz[stage]["correctindex"]) {
       alert("Correct!!");
       quiz[stage]["correct"] = 1;
    }
    else {
       alert("Incorrect...");
    }
    stage += 1;
    checkedindex = -1;
    if (stage >= questions.length) {
        state = "done";
    }
    
    draw();
}

function get_total() {
    var total = 0;
    for (var i=0;i<quiz.length;i++) {
        total += quiz[i]["correct"];
    }
    return total;
}

function create_random_array(length, exclude) {
    var arr = [];
    for (var i=0;i<questions.length;i++) {
        if (i != exclude)
            arr.push(i);
    }
    return arr;
}

function draw() {
    if (state == "quiz") {
        load_question();
        $("#quizform").show();
        $("#donediv").hide();
    }
    else if (state == "done") {
        load_score();
        $("#quizform").hide();
        $("#donediv").show();
    }
}

function load_question() {
    $(".radioanswer").prop("checked", false).checkboxradio("refresh");
    $("#scorediv").html("<h2>Score: " + get_total() + "/" + quiz.length +"</h2>");
    $("#legend").html("Question " + (stage+1) + ": " + quiz[stage]["text"]);
    for (var i=0;i<4;i++) {
        $("#label"+i).html(quiz[stage]["answers"][i]["answer"]);
    }
    $(".labelanswer").click(function() {
        var i = $(".labelanswer").index(this);
        quiz[stage]["answers"][i]["audio"].play();
    });
    $("#picturediv").html("<img src='" + quiz[stage]["answer"] + ".jpg'>");
}

function load_score() {
    var total = get_total();
    s = "Your final score is " + total + "/" + quiz.length + "<br>";
    s += "Your grade is " + (total / quiz.length) * 100 + "% <br>";

    $("#tallydiv").html(s);
}

function load_complete(audio) {
    loading--;
    console.log("Loaded audio No. " + loading);
    if (loading == 0) { //all sounds are preloaded
        //for (var i=0;i<audios.length;i++)
        //    audios[i].removeEventListener("canplaythrough", load_complete, false);
        audio.oncanplay = null;
        reset_quiz();
    }
}

function load_audio(name) {
    loading++;
    var audio = document.createElement("audio");
    audios.push(audio);
    audio.loop = false;
    audio.preload = "auto";
    //audio.addEventListener("canplay", load_complete, false);
    audio.oncanplay = function() { load_complete(audio); };
    audio.src = name + ".mp3";
}

function reset_quiz() {
    stage = 0;
    state = "quiz";
    checkedindex = -1;

    var arr = create_random_array(questions.length);

    //load quiz data
    for (var i=0;i<questions.length;i++) {
        var q = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
        var arr2 = create_random_array(questions.length, q);
        quiz[i] = {};
        quiz[i]["text"] = questions[q]["text"];
        quiz[i]["answer"] = questions[q]["answer"];
        quiz[i]["audio"] = audios[q];
        quiz[i]["answers"] = [];
        quiz[i]["correct"] = 0;
        for (var j=0;j<4;j++) {
            var a = arr2.splice(Math.floor(Math.random() * arr2.length), 1)[0];
            quiz[i]["answers"][j] = questions[a];
            quiz[i]["answers"][j]["audio"] = audios[a];
        }
        var correctindex = Math.floor(Math.random() * 4);
        quiz[i]["correctindex"] = correctindex;
        quiz[i]["answers"][correctindex] = questions[q];
        quiz[i]["answers"][correctindex]["audio"] = audios[q];
    }
    draw();
}

function start_quiz() {
    for (var i=0;i<questions.length;i++)
        load_audio(questions[i]["answer"]);
}
