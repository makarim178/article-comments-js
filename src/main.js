const GET_COMMENTS_API_ENDPOINT = '/comments'
const POST_COMMENTS_API_ENDPOINT = '/comments/post'
const COMMENTS_CONTAINER_ID = 'commentsContainer'
const COMMENTS_SUBMIT_ID = 'submitBtn'

export const fetchData = async (api) => {
  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return response.json().then(res => res.data);
  } catch (error) {
    console.log(error.message);
  }
}

const createDynamicElement = (elType, elTextContent) => {
  const element = document.createElement(elType);
  const textContent = document.createTextNode(elTextContent);
  element.appendChild(textContent);
  return element
}

const createImageElement = (altName, src) => {
  const imgElement = document.createElement('img');
  imgElement.src = src;
  imgElement.alt = `Image of ${altName}`;
  return imgElement;
}

const createCommentElement = ({name, content, avatar}) => {
  const contentElement = createDynamicElement('p', content);
  const nameElement = createDynamicElement('h3', name);
  const imgElement = createImageElement(name, avatar);
  
  const subContainer = document.createElement('div');
  subContainer.append(nameElement, contentElement);
  
  const wrapContainer = document.createElement('div');
  wrapContainer.append(imgElement, subContainer);
  return wrapContainer;
}

const clearFormElements = (els) => {
  for (let el of els) el.value = "";
}

const scrollToEnd = () => {
  const wrapperEl = document.querySelector('.wrapper');
  if (!wrapperEl) return; 
  
  wrapperEl.scrollTop = wrapperEl.scrollHeight;
}

const renderComment = (comment) => {
  const mainContainer = document.getElementById(COMMENTS_CONTAINER_ID);
  mainContainer.appendChild(createCommentElement(comment));
  scrollToEnd()
}

const postComment = async (e) => {
  
  const nameEl = document.getElementById('name');
  const commentEl = document.getElementById('comment');
  
  const body = {
    name: nameEl.value,
    content: commentEl.value
  }
  
  const options = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
  
  
  try {
    const postComment = await fetch(POST_COMMENTS_API_ENDPOINT, options);
    
    if(!postComment.ok) throw new Error(`Response status: ${postComment.status}`);
    clearFormElements([nameEl, commentEl]);    
    postComment.json().then(res => renderComment(JSON.parse(res.data)));
  } catch (error) {
    console.log(error.message);
  }
  
}

export const main = async () => {
  // Excute your code here
  const data = await fetchData(GET_COMMENTS_API_ENDPOINT);
  data.forEach(renderComment)  
  
  const submitBtnEl = document.getElementById(COMMENTS_SUBMIT_ID);
  submitBtnEl.addEventListener('click', postComment);
}

