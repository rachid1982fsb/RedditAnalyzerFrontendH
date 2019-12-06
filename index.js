

let userName = "spez"
let userSearchName = "spez"
let gildedLink = ""
let gildedNum 
let gildedBod = ""
let upsLink = ""
let upsbod = ""
let upsNum 
let fav_sub = ""


const postsPerRequest = 100;
const maxPostsToFetch = 500;
const maxRequests = maxPostsToFetch / postsPerRequest

let reRankArr = [];

let responses = [];


document.addEventListener('DOMContentLoaded', () => {
  let hiddenApp = document.getElementById("3a")
  hiddenApp.style.display = "none";


    console.log('DOM fully loaded and parsed');
    login();
    signUp();


  function login(){
        const loginContainer = document.getElementById("2a") 
        let loginSubmit = document.getElementById("1a")
        let hiddenLoad = document.getElementById("loading")
        hiddenLoad.style.display = "none";

        loginSubmit.addEventListener('click', event => {
            event.preventDefault();
            const userNameInput = document.getElementById('usrLogin').value;
            userName = userNameInput
            fetchUserPost(userNameInput, loginContainer);
        })
    }


    const handleSubmit = e => {
      responses = [];

        event.preventDefault();

        let hiddenLoad = document.getElementById("loading")
        hiddenLoad.style.display = "block";
        const userInput = document.getElementById('user').value;
       userSearchName = userInput

        fetchPosts(userInput);
      };
      
      const fetchPosts = async (userInput, afterParam) => {
        const response = await fetch(
          `https://www.reddit.com/user/${userInput}/comments/.json?limit=${postsPerRequest}${
            afterParam ? '&after=' + afterParam : ''
          }`
        )
        //console.log(response)
        const responseJSON = await response.json();
        responses.push(responseJSON);
      
        if (responseJSON.data.after && responses.length < maxRequests) {
          fetchPosts(userInput, responseJSON.data.after);
          return;
        }
        parseResults(responses);
      };
      
      const parseResults = responses => {
        let allPosts = [];

        responses.forEach(response => {
          allPosts.push(...response.data.children);
        });
        
        ////////////////send the posts to analyzePosts function
        analyzePosts(allPosts)
        
        ///////////////////////////////////////////////

        statsByUser = {};
      
        allPosts.forEach(({ data: { author, score } }) => {
          statsByUser[author] = !statsByUser[author]
            ? { postCount: 1, score }
            : {
                postCount: statsByUser[author].postCount + 1,
                score: statsByUser[author].score + score
              };
        });
      
        const userList = Object.keys(statsByUser).map(username => ({
          username,
          score: statsByUser[username].score,
          postCount: statsByUser[username].postCount
        }));
      
        const sortedList = userList.sort((userA, userB) => userB.score - userA.score);

      
        displayRankings(sortedList);
        allPosts = [];

      };
      
      const displayRankings = sortedList => {
        const container = document.getElementById('results-container');
        sortedList.forEach(({ username, score, postCount }, i) => {
          rank = i + 1;
          const userCard = document.createElement('a');
          userCard.href = `https://www.reddit.com/user/${username}`;
          userCard.hidden = true;
          userCard.classList.add('user-card');
          userCard.innerText = `${rank}. ${username} = ${postCount} post(s) - ${score} points`;
      
          container.appendChild(userCard);
        });
        sortedList = [];

        //clear reRank array to preprare for a new re-rank
        reRankArr = [];
        reRank();
  
      };
      ///////////////////////////////////////////////////////////////////
      const userSelectForm = document.getElementById('user-select-form');
      userSelectForm.addEventListener('submit', handleSubmit);
      //////////////////////////////////////////////////////////////////

      const reRank = () => {
    
        let userCardRerank = document.getElementsByClassName('user-card')
       
        
        for(let i = 0; userCardRerank.length > i; i++){
            
          let lopOff = userCardRerank[i].innerText;

          const scoreGetter = /(\d+)(?!.*\d)/g;
          const scoreString = lopOff.match(scoreGetter)
          let scoreInt = parseInt(scoreString)

          const commentsGetter = /\s+0*(\d+)/
          const commentsString = lopOff.match(commentsGetter)
          let commentsInt = parseInt(commentsString)


          const userGetter = /(?<=^\S*\s+)\S+/
          const userString = lopOff.match(userGetter)


          let instanceArr = [userString[0], commentsInt, scoreInt]

          let hiddenLoad = document.getElementById("loading")
          hiddenLoad.style.display = "none";

          reRankArr.push(instanceArr) 
          }


          setTimeout(function(){       
            let elements = document.getElementsByClassName('user-card');
            while(elements.length > 0){
              elements[0].parentNode.removeChild(elements[0]);
          }}, 1000);

          let sortedArray = reRankArr.sort(function(a, b) {
            return b[2] - a[2];
          });

        setTimeout(function(){ 
        for(let j = 0; sortedArray.length > j; j++){

          ranker = j + 1;
          const redditCard = document.createElement('a');
          redditCard.href = `https://www.reddit.com/user/${sortedArray[j][0]}`;
          redditCard.classList.add('user-card');
          redditCard.innerText = `${ranker}. ${sortedArray[j][0]} = ${sortedArray[j][1]} post(s) - ${sortedArray[j][2]} points`;

          const container = document.getElementById('results-container');
          container.append(redditCard)
        }}, 3000)

        window.onload = function () {

          $("#loading").hide();    
          
             };

      }

      const analyzePosts = (allPosts) => {
       
        let postInstanceArr = [];
        let postInstanceArr2 = [];
        let postInstanceArr3 = [];

        for(let d = 0; allPosts.length > d; d++){
          let body = allPosts[d].data.body
          let score = allPosts[d].data.score
          let num_comments = allPosts[d].data.num_comments
          let link_permalink = allPosts[d].data.link_permalink
          let downs = allPosts[d].data.downs
          let ups = allPosts[d].data.ups
          let link_url = allPosts[d].data.link_url
          let gilded = allPosts[d].data.gilded
          let subreddit = allPosts[d].data.subreddit

          let thisPost = [score, body, num_comments, link_permalink, downs, ups, link_url, gilded, subreddit]
          postInstanceArr.push(thisPost)
          postInstanceArr2.push(thisPost)
          postInstanceArr3.push(thisPost)

        }

        const list = postInstanceArr.map(child => child[8]);

        console.log(top5Subreddit(list));

        piechart(top5Subreddit(list));

        gildedSort(postInstanceArr)

        numCommentsSort(postInstanceArr2)

        upsSort(postInstanceArr3);

        fetchUserSearch()

      }

      const upsSort = (postInstanceArr3) => {
        let upsSort = [];
        upsSort = postInstanceArr3.sort(function(a, b) {
          return b[5] - a[5];
        });

        let upsDisplay = document.getElementById("results-highscore-container")
        upsDisplay.innerHTML = ""

        let upsNumber = document.createElement('a')

        upsNum = upsSort[0][5]

        upsNumber.textContent = upsSort[0][5] + " " + "Karma" + " "
        let upsBody = document.createElement('a')
        let upsH5 = document.createElement('h5')
        upsH5.innerText = "Highest Scored Comment"
        upsbod = upsSort[0][1]
        upsBody.textContent = upsbod
        upsLink = upsSort[0][6]

        upsBody.href = upsLink

        upsDisplay.append(upsH5, upsNumber, upsBody)

      }

      const numCommentsSort = (postInstanceArr2) => {
        let numCommentsSort = [];
        numCommentsSort = postInstanceArr2.sort(function(a, b) {
          return b[2] - a[2];
        });

        let numCommentsDisplay = document.getElementById("results-highcomments-container")
        numCommentsDisplay.innerHTML = ""

        let numCommentsNumber = document.createElement('a')
        numCommentsNumber.textContent = numCommentsSort[0][2] + " " + "Comment Children(s)" + " "
        let numCommentsBody = document.createElement('a')
        let numCommentsH5 = document.createElement('h5')
        numCommentsH5.innerText = "Highest Number of Comment Children"
        numCommentsBody.textContent = numCommentsSort[0][1]
        numCommentsBody.href = `${numCommentsSort[0][6]}`

        numCommentsDisplay.append(numCommentsH5, numCommentsNumber, numCommentsBody)
       
      }

      const gildedSort = (postInstanceArr) => {
        let gildedSort = [];
        gildedSort = postInstanceArr.sort(function(a, b) {
          return b[7] - a[7];
        });

        let gildedDisplay = document.getElementById("results-highgilded-container")
        gildedDisplay.innerHTML = ""

        let gildedNumber = document.createElement('a')

        gildedNum = gildedSort[0][7]
        gildedBod = gildedSort[0][1]
        gildedNumber.textContent = gildedNum + " " + "Gilding(s)" + " "
        let gildedBody = document.createElement('a')
        let gildedH5 = document.createElement('h5')
        gildedH5.innerText = "Most Gildings on Comments"
        gildedBody.textContent = gildedBod
        gildedLink = gildedSort[0][6]
        gildedBody.href = gildedLink

        gildedDisplay.append(gildedH5, gildedNumber, gildedBody)


        if(gildedSort[0][7] < 1){
          gildedDisplay.removeChild(gildedBody, gildedH5, gildedNumber)
          let neverGuild = document.createElement('a')
          neverGuild.innerText = "Not Yet Recieved Gold"
          gildedDisplay.append(neverGuild)
        }
      }

      function top5Subreddit(listsubreddit){
        top5 = subredditsCount(listsubreddit).slice(0, 5)
        if(top5.length < 5){
          for(let i=top5.length; i<5; i++){
            top5[i]=["",0]
          }
        }
        fav_sub = top5[0][0]
        console.log(fav_sub)
        return top5
      }

      function subredditsCount(listsubreddit){
        const array = listsubreddit.map(e => SubredditNum(listsubreddit, e))
        let unique = array.map(ar=>JSON.stringify(ar))
                .filter((itm, idx, arr) => arr.indexOf(itm) === idx)
                 .map(str=>JSON.parse(str));
        let uniqueSorted = unique.sort(function(a, b){return b[1]-a[1]})
        return uniqueSorted
      }


      function SubredditNum(arr, e){  
        let h = [e]
        arr.reduce(function(memo, num){ 
                     if(num===e)
                        { memo +=1 }
                    return h[1] = memo}, 0) 
        return h  
        }
function piechart(ar){
      let total= ar[0][1]+ar[1][1]+ar[2][1]+ar[3][1]+ar[4][1]
       const reddit1Lables = ar[0][0] + " " + Math.round(100*(ar[0][1])/total)+ "%"
       const reddit2Lables = ar[1][0] + " " + Math.round(100*(ar[1][1])/total)+ "%"
       const reddit3Lables = ar[2][0] + " " + Math.round(100*(ar[2][1])/total)+ "%"
       const reddit4Lables = ar[3][0] + " " + Math.round(100*(ar[3][1])/total)+ "%"
       const reddit5Lables = ar[4][0] + " " + Math.round(100*(ar[4][1])/total)+ "%"

        let labels = [reddit1Lables, reddit2Lables, reddit3Lables, reddit4Lables, reddit5Lables];
        let data = [
            100*(ar[0][1])/total,
            100*(ar[1][1])/total,
            100*(ar[2][1])/total,
            100*(ar[3][1])/total,
            100*(ar[4][1])/total
        ];
        let pie = document.getElementById("myChart").getContext('2d');
        let myChart = new Chart(pie, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        borderColor: ['rgba(160, 42, 192, 1)','rgba(47, 42, 192, 1)','rgba(75, 192, 192, 1)', 'rgba(192, 0, 0, 1)','rgba(192, 75, 192, 0.5)'],
                        backgroundColor: ['rgba(160, 42, 192, 0.2)','rgba(47, 42, 192, 0.2)','rgba(75, 192, 192, 0.2)', 'rgba(192, 0, 0, 0.2)','rgba(192, 75, 192, 0.5)'],
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: "User Top Subreddit"
                }
            }
        });
        
    }

    function fetchUserPost(input, loginContainer){
        fetch(`https://redditanalyzerbackend.herokuapp.com/users`).then(resp => resp.json()).then(function(userData){
          let found = userData.find(user => user.username === input)
          if(found){loginContainer.style.display = "none";
          console.log("The user found")
          hiddenApp.style.display = "block";}
          else{console.log("Please regester first")}
        });
    }

    function signUp(){
      const userNameInput = document.getElementById('usrLogin') 
        const loginContainer = document.getElementById("2a") 
        let taco = document.getElementById("4a")
        taco.addEventListener('click', event => {
            event.preventDefault();
            const signUpH2 = document.createElement('h2')
            const singUpForm = document.getElementById('loginForm')

            signUpH2.innerHTML= "SignUp"
            const signUpinputUserName = document.createElement('input')
            const submit= document.createElement('button')
            const signupDiv= document.createElement('div')

            submit.innerText="Submit"
            signUpinputUserName.value ="User Name"

            signupDiv.appendChild(signUpH2)
            signupDiv.appendChild(submit)
            signupDiv.appendChild(signUpinputUserName)
            singUpForm.appendChild(signupDiv)
            
            submit.addEventListener('click', function(e){
                e.preventDefault();
                userNameInput.value = signUpinputUserName.value
                fetchSignup(signUpinputUserName.value)
                signupDiv.style.display = "none"
                
            })
        })
    }

    function fetchSignup(userName){
        fetch(`https://redditanalyzerbackend.herokuapp.com/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({username: userName})
          }).then(function(resp) {
            if (Math.floor(resp.status/200) === 1) {
              console.log("Great ")
            } else {
              console.log("ERROR", resp)
            }
          });
    }
  
    function fetchUserSearch(){
      fetch(`https://redditanalyzerbackend.herokuapp.com/user_searches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
      },
      body: JSON.stringify({
        // username: userName,
        username: userName, 
        user_search: {
        reddit_username: userSearchName,
        top_listing_name: upsbod,
        top_listing_likes: upsNum,
        top_listing_link: upsLink,
        fav_sub_name: fav_sub,
        most_children_name: gildedBod,
        Most_children_likes: gildedNum, 
        most_children_link: gildedLink
      }
      })
      }).then(function(resp) {
        if (Math.floor(resp.status/200) === 1) {
          console.log("Great ")
        } else {
          console.log("ERROR", resp)
        }
      })
    }
  })
