// the code used to create the bookmarklet
$.couch.allDbs({
  success : function(dbs) {
    function commitDbs(list) {
      var db = list.pop();
      $.ajax({
        type: "POST", url: "/" + encodeURIComponent(db) + "/_ensure_full_commit",
        contentType: "application/json", dataType: "json",
        complete : function(r) {
          $("#content").prepend('<ul id="commit_all"></ul>');
          if (r.status == 201) {
            $("#commit_all").append('<li>committed: '+db+'</li>');                
          } else {
            $("#commit_all").append('<li style="color:red;">error: '+db+'</li>');                
          }
          if (list.length > 0) {commitDbs(list);}
        }
      });
    }
    commitDbs(dbs);
  }
});

// Condensed to a bookmarklet. When inserting into the 1.0.1.txt
// template you have to double the % escapes so Python doesn't
// choke. In vim, you can run the following command on the line:
//
//     :s/%/%%/g
//
// I've included the double-percents version below.
//
javascript:%24.couch.allDbs%28%7Bsuccess%3Afunction%28dbs%29%7Bfunction%20commitDbs%28list%29%7Bvar%20db%3Dlist.pop%28%29%3B%24.ajax%28%7Btype%3A%22POST%22%2Curl%3A%22%2F%22%2BencodeURIComponent%28db%29%2B%22%2F_ensure_full_commit%22%2CcontentType%3A%22application%2Fjson%22%2CdataType%3A%22json%22%2Ccomplete%3Afunction%28r%29%7B%24%28%22%23content%22%29.prepend%28%27%3Cul%20id%3D%22commit_all%22%3E%3C%2Ful%3E%27%29%3Bif%28r.status%3D%3D201%29%7B%24%28%22%23commit_all%22%29.append%28%27%3Cli%3Ecommitted%3A%20%27%2Bdb%2B%27%3C%2Fli%3E%27%29%3B%7Delse%7B%24%28%22%23commit_all%22%29.append%28%27%3Cli%20style%3D%22color%3Ared%3B%22%3Eerror%3A%20%27%2Bdb%2B%27%3C%2Fli%3E%27%29%3B%7Dif%28list.length%3E0%29%7BcommitDbs%28list%29%3B%7D%7D%7D%29%3B%7DcommitDbs%28dbs%29%3B%7D%7D%29%3B

// The version for 1.0.1.txt

javascript:%%24.couch.allDbs%%28%%7Bsuccess%%3Afunction%%28dbs%%29%%7Bfunction%%20commitDbs%%28list%%29%%7Bvar%%20db%%3Dlist.pop%%28%%29%%3B%%24.ajax%%28%%7Btype%%3A%%22POST%%22%%2Curl%%3A%%22%%2F%%22%%2BencodeURIComponent%%28db%%29%%2B%%22%%2F_ensure_full_commit%%22%%2CcontentType%%3A%%22application%%2Fjson%%22%%2CdataType%%3A%%22json%%22%%2Ccomplete%%3Afunction%%28r%%29%%7B%%24%%28%%22%%23content%%22%%29.prepend%%28%%27%%3Cul%%20id%%3D%%22commit_all%%22%%3E%%3C%%2Ful%%3E%%27%%29%%3Bif%%28r.status%%3D%%3D201%%29%%7B%%24%%28%%22%%23commit_all%%22%%29.append%%28%%27%%3Cli%%3Ecommitted%%3A%%20%%27%%2Bdb%%2B%%27%%3C%%2Fli%%3E%%27%%29%%3B%%7Delse%%7B%%24%%28%%22%%23commit_all%%22%%29.append%%28%%27%%3Cli%%20style%%3D%%22color%%3Ared%%3B%%22%%3Eerror%%3A%%20%%27%%2Bdb%%2B%%27%%3C%%2Fli%%3E%%27%%29%%3B%%7Dif%%28list.length%%3E0%%29%%7BcommitDbs%%28list%%29%%3B%%7D%%7D%%7D%%29%%3B%%7DcommitDbs%%28dbs%%29%%3B%%7D%%7D%%29%%3B
