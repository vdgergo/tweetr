
import { tweetsData2 } from './data.js'
let tweetsData = tweetsData2
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

readFromLocalStorage()

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like)
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.replyto){
        handleReplyToClick(e.target.dataset.replyto)
    }
    else if(e.target.id === 'popup-close-btn'){
        document.getElementById(e.target.id).parentElement.classList.add("hidden")
    }
    else if(e.target.id === 'reply-btn'){
        handleReplyBtnClick()
    }
    if(e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
     }

})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleReplyToClick(replyId){
    const repliedTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === replyId})[0]
    
    document.getElementById("replied-tweet").innerHTML = 
    `
    <img src="${repliedTweetObj.profilePic}" class="profile-pic">
	<div class ="reply-inner">
	<p class="handle">${repliedTweetObj.handle}</p>
	<p class="tweet-text">${repliedTweetObj.tweetText}</p>
    `

    document.getElementById('reply-btn').dataset.replieduuid = replyId
    document.getElementById('reply-popup').classList.toggle("hidden")  
    console.log(document.getElementById('reply-btn'))

}
function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }
}

function handleReplyBtnClick(){
    const replyInputEl = document.getElementById('reply-input')
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === document.getElementById('reply-btn').dataset.replieduuid
    })[0]

    if(replyInputEl.value){
        targetTweetObj.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: `${replyInputEl.value}`,
            })  
        replyInputEl.value = ''
        document.getElementById('reply-popup').classList.toggle('hidden')
        render()      
        }   
    }

function handleDeleteClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    const index = tweetsData.indexOf(targetTweetObj)
    tweetsData.splice(index, 1)
    render()
}


function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>                
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-reply fa-solid"
                    data-replyto="${tweet.uuid}"
                    ></i>
                </span>
                    <span class="tweet-detail">
                    <i class="fa-solid fa-trash"
                    data-delete="${tweet.uuid}"
                ></i>
            </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
    writeToLocalStorage()
}

function writeToLocalStorage(){
    localStorage.setItem('tweetsData',JSON.stringify(tweetsData))
}

function readFromLocalStorage(){
    if (localStorage.tweetsData) {
        tweetsData = JSON.parse(localStorage.getItem('tweetsData'))
    }
}

render()



