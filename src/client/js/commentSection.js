const form = document.getElementById("commentForm");
const del = document.getElementsByClassName("del");

const addComment = (text, commentId) => {
    let profile;
    const profileData = document.getElementById("profile").dataset;
    const profileLink = `/users/${profileData.id}`;
    try{
        profile = document.getElementsByClassName("header__avatar")[0];
    } catch(error){
        profile = undefined;
    }
    const videoComments = document.querySelector("#comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    newComment.dataset.id = commentId;
    const comment = document.createElement("div");
    const linkImg = document.createElement("a");
    linkImg.href = profileLink;
    comment.className = "comment";
    const profileImg = document.createElement("img");
    if(!profile){
        profileImg.style = "display: none;"; 
    }else{
        profileImg.src = profile.src;
    }
    profileImg.className = "comment__avatar";
    const username = document.createElement("a");
    username.href = profileLink;
    username.innerText = profileData.name;
    const content = document.createElement("span");
    content.innerText = text;
    const del = document.createElement("span");
    del.className = "del";
    del.dataset.id = commentId;
    del.innerText = "X";
    del.addEventListener("click", handleDelete);
    linkImg.appendChild(profileImg);
    comment.appendChild(linkImg);
    comment.appendChild(username);
    comment.appendChild(content);
    comment.appendChild(del);
    newComment.appendChild(comment);
    videoComments.prepend(newComment);
    return;
}

const textarea = form.querySelector("textarea");
const videoContainer = document.getElementById("videoContainer");

const handleSubmit = async(event) => {
    event.preventDefault();
    const text = textarea.value;
    textarea.value = "";
    const video = videoContainer.dataset.id;
    if(text===""){
        return;
    }
    const response = await fetch(`/api/videos/${video}/comment`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({text}),
    });
    if(response.status===201){
        const {commentId} = await response.json();
        addComment(text, commentId);
    }
    return;
};

const deleteComment = (commentId) => {
    const comments = document.getElementsByClassName("video__comment");
    let commentIdx;
    for(commentIdx in comments){
        const comment = comments[commentIdx];
        if(comment.dataset.id === commentId){
            comment.remove();
        }
    }
    return;
};

const handleDelete = async(event) => {
    const commentId = event.target.dataset.id;
    const videoId = document.getElementById("videoContainer").dataset.id;
    const response = await fetch(`/api/comments/${commentId}/delete`, {
        method:"DELETE",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({videoId})
    });
    console.log(commentId, videoId, response);
    if(response.status===201){
        deleteComment(commentId);
    } else{
        return;
    }
    return;
}

if(form){
    form.addEventListener("submit", handleSubmit);
};
for(_ in del){
    del[_].addEventListener("click", handleDelete);
}