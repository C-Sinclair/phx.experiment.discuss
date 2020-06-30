import { Socket } from "phoenix"

const socket = new Socket("/socket", {params: {token: window.userToken}})
socket.connect()

const createSocket = (topicId) => {
  const channel = socket.channel(`comments:${topicId}`, {})
  channel.join()
    .receive("ok", res => renderComments(res.comments))
    .receive("error", resp => { 
      console.log("Unable to join", resp) 
    })

  channel.on(`comments:${topicId}:new`, res => renderComment(res.comment))
  
  document
    .querySelector('button')
    .addEventListener('click', () => {
      const content = document.querySelector('textarea').value
      channel.push('comments:add', { content })
    })
}

window.createSocket = createSocket

const renderComment = comment => {
  const html = commentTemplate(comment)
  document.querySelector('ul.collection').innerHTML += html
}

const renderComments = comments => {
  const html = comments.map(commentTemplate).join('')
  document.querySelector('ul.collection').innerHTML = html
}

const commentTemplate = comment => `
  <li class="collection-item">
    ${comment.content}

    <div class="secondary-content">
      ${comment.user?.email ?? "Anonymous"}
    </div>
  </li>
`