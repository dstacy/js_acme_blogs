// Creates a new HTML element and returns the element
const createElemWithText = (elemType = "p", textContent = "", className) => {
    const myElemWithText = document.createElement(elemType);
    myElemWithText.textContent = textContent;
    if(className) {
        myElemWithText.classList.add(className);
    }
    return myElemWithText;
}

// Loops through users data and creates HTML option elements and returns an array of option elements
const createSelectOptions = (users) => {
    const myUserArray = new Array;
    if(!users) { return; }
    else {
        users.forEach(user => {
            const myOption = document.createElement("option");
            myOption.value = user.id;
            myOption.textContent = user.name;
            myUserArray.push(myOption);
        });
    }
    return myUserArray;
}

// Toggles the "hide" class on the section element and returns a section element
const toggleCommentSection = (postId) => {
    if(!postId) {return; }
    const section = document.querySelector(`section[data-post-id='${postId}']`);
    if(!section) { return null; }
    else {
        const classes = section.classList.toggle("hide");
    }
    return section;
}

// Toggles the Comment button between "Show Comments" and "Hide Comments" and returns the button element
const toggleCommentButton = (postId) => {
    if(!postId) { return; }
    const button = document.querySelector(`button[data-post-id='${postId}']`);
    if(!button) { return null; }
    button.textContent === "Show Comments" ? button.textContent = "Hide Comments" : button.textContent = "Show Comments";
    return button;
}

// Deletes all child elements from a parent element and returns the parent element with child elements removed
const deleteChildElements = (parentElement) => {
    if(!parentElement?.tagName) { return; }
    let child = parentElement.lastElementChild; 
    while(child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

// Adds click event listeners to buttons inside the main element and returns the button elements
const addButtonListeners = () => {
    const buttons = document.querySelectorAll("main button");
    if(!buttons) { return; }
    for(const button of buttons) {
        const postId = button.dataset.postId;
        button.addEventListener("click", function (e) {toggleComments(e, postId)}, false);
    }
    return buttons;
}

// Removes main button event listeners and returns the button elements
const removeButtonListeners = () => {
    const buttons = document.querySelectorAll("main button");
    if(!buttons) { return; }
    for(const button of buttons) {
        const postId = button.dataset.postId;
        button.removeEventListener("click", function (e) {toggleComments(e, postId)}, false);
    }
    return buttons;
}

// Creates an article element, h3 element, and two paragraph elements and 
// returns a fragment with all elements appended.
const createComments = (posts) => {
    if(!posts) { return; }
    const fragment = new DocumentFragment();
    for(const comment of posts) {
        const articleElem = document.createElement("article");
        const h3Elem = createElemWithText("h3", comment.name);
        const pElem = createElemWithText("p", comment.body);
        const pElem2 = createElemWithText("p", `From: ${comment.email}`);
        articleElem.append(h3Elem, pElem, pElem2);
        fragment.append(articleElem);
    };
    return fragment;
}

// Appends each option element to the select menu and returns the selectMenu
const populateSelectMenu= (posts) => {
    if(!posts) { return; }
    const selectMenu = document.getElementById("selectMenu");
    const optionsArray = createSelectOptions(posts);
    optionsArray.forEach((option) => {
        selectMenu.append(option);
    });   
    return selectMenu;
};

// Async/Await functions

// Fetches users data and returns the users json data
const getUsers = async () => {
    try {
        const users = await fetch("https://jsonplaceholder.typicode.com/users");  
        if(!users.ok) throw new Error("Status code not in 200-299 range");  
        return await users.json();
    } 
    catch(err) {
        return err;
    }
}

// Fetches posts for a specified user and returns the posts json data
const getUserPosts = async (userId) => {
    if(!userId) { return; }
    try {
        const posts = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if(!posts.ok) throw new Error("Status code not in 200-299 range");
        return await posts.json();
    }
    catch(err) {
        return err;
    }
}

// Fetches a specific user and returns the user json data
const getUser = async (userId) => {
    if(!userId) { return; }
    try {
        const user = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if(!user.ok) throw new Error("Status code not in 200-299 range");
        return await user.json();
    }
    catch(err) {
        return err;
    }
}

// Fetches comments for a specific post Id and returns the comments json data
const getPostComments = async (postId) => {
    if(!postId) { return; }
    try {
        const comments = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        if(!comments.ok) throw new Error("Status code not in 200-299 range");
        return await comments.json();
    }
    catch(err) {
        return err;
    }
}

// Creates a section element, by calling createElement(), adds classes "comments" and "hide" to it, gets posts for a specified post Id, 
// using getPostComments(), creates comments using createComments(), and appends the comments to the section element.  Returns the section element
const displayComments = async (postId) => {
    if(!postId) { return; }
    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.append(fragment);
    return section;
}

// Creates posts by creating elements using createElement() and createElemWithText(), 
// getting posts by userIds using getUser(), calling displayComments(), and appending the new elements to a
// Document Fragment.  Returns the fragment with elements and post data appended.
const createPosts = async (posts) => {
    if(!posts) { return; }
    const fragment = new DocumentFragment();
    for(const post of posts) {
        const article = document.createElement("article");
        const h2Elem = createElemWithText("h2", post.title);
        const para = createElemWithText("p", post.body);
        const para2 = createElemWithText("p", `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const para3 = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
        const para4 = createElemWithText("p", author.company.catchPhrase);
        const button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;
        article.append(h2Elem, para, para2, para3, para4, button);
        const section = await displayComments(post.id);
        article.append(section);
        fragment.append(article);
    };
    return fragment;
}

// Calls createPosts() if posts exists, and assigns the value to an element variable that is 
// appended onto the main element.  If no posts exist, a new element is created with default values.
// The element variable is returned.
const displayPosts = async (posts) => {
    const mainElem = document.querySelector("main");
    const text = "Select an Employee to display their posts."
    const element = posts ? await createPosts(posts) : createElemWithText("p", text, "default-text");
    mainElem.append(element);
    return element; 
}

// Sets event.target.listener.  Passes a postId to toggleCommentSection and toggleCommentButton and assigns those results to variables
// Returns an array that contains the variables created
const toggleComments = (event, postId) => {
    if(!event || !postId) { return; }
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    const arry = [section, button];
    return arry;
};

// Calls removeButtonListeners(), deletChildElements(), displayPosts, and addButtonListerns.  Assings
// the results to variables and returns an array that contains the variables created.
const refreshPosts = async (posts) => {
    if(!posts) { return; }
    const removeButtons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector("main"));
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    const arry = [removeButtons, main, fragment, addButtons];
    console.log(main);
    return arry;
}

// Receives an event, passes the event target value or the value 1 if target doesn't exist, to getUserPosts(),
// Calls refreshPosts using post data from getUserPosts, returns an array that contains the userId, the posts, 
// and the array returned from refreshPosts.
const selectMenuChangeEventHandler = async (e) => {
    const userId = e?.target?.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    const arry = [userId, posts, refreshPostsArray];
    return arry;
}

// Calls getUsers(), passes the users to populateSelectMenu(), and returns an array that contains
// the users and the select menu
const initPage = async () => {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    const arry = [users, select];
    return arry;
}

// Adds an event listener to the select menu, that calls selectMenuChangeEventHandler()
const initApp = async () => {
    initPage();
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", function (e) {selectMenuChangeEventHandler()}, false);
}

// Call the script into action by adding an event listener that listens for the
// DOM content to load and calls initApp()
document.addEventListener("DOMContentLoaded", function (e) {initApp()}, false);


