var scripts = [
    "http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js",
];

for(i = 0; i < scripts.length; i++) {
    document.write("<script src='" + scripts[i] + "'></script>");
}

function check_flag() {
    if ($("body").hasClass("complete")) {
        throw "Document processing is already complete.";
    }
}

function raise_flag() {
    $("body").addClass("complete");
}
function add_toc() {
    var old_depth = 0;
    var html = "";
    $("*/[id!='']").each(function(index) {
        var id = $(this).attr("id");
        var name = $(this)[0].nodeName;
        var text = $(this).text();
        if (name.length != 2 || name.slice(0, 1) != "H") {
            return;
        }
        var new_depth = name.slice(1,2);
        if (new_depth > old_depth) {
            html += "<ul>";
        } else if (new_depth < old_depth) {
            html += "</li></ul></li>";
        } else {
            html += "</li>";
        }
        html += "<li><a href='#" + id + "'>" + text + "</a>";
        old_depth = new_depth;
    });
    html += "</li></ul>";
    $(".toc").append(html);
}

document.onready = function() {
    try {
	check_flag();
	raise_flag();
        add_toc();
    } catch (error) {
        // uh oh
    }
}
