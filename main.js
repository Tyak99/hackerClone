var ul = document.querySelector(".news-ul");

fetch("https://hacker-news.firebaseio.com/v0/topstories.json?")
  .then(response => response.json())
  .then(ids => {
    // reduce the number of response to 30
    data = ids.slice(1, 31);
    let requests = data.map(data =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${data}.json`)
    );

    Promise.all(requests)
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then(stories =>
        stories.forEach(story => {
          //div for the card
          card = document.createElement("div");
          card.setAttribute("class", "card");

          //a with a href attribute for links
          anchor = document.createElement("a");
          anchor.setAttribute("href", story.url);
          anchor.setAttribute("target", "_blank");

          //author tag
          author = document.createElement("h4");
          author.setAttribute("class", "author");
          author.textContent = `${story.by}`;

          //list tag
          list = document.createElement("li");
          list.appendChild(anchor);
          list.appendChild(author);
          list.setAttribute("class", "list");

          var node = document.createTextNode(story.title);
          anchor.appendChild(node);
          card.appendChild(list);

          ul.appendChild(card);

          //SCROLLING EFFECT ANIMATION

          //to optimize the scroll effect timeframe
          var isScrolling = false;
          window.addEventListener("scroll", throttleScroll, false);
          function throttleScroll(e) {
            if (isScrolling == false) {
              window.requestAnimationFrame(function() {
                scrolling(e);
                isScrolling = false;
              });
            }
            isScrolling = true;
          }
          document.addEventListener("DOMContentLoaded", scrolling, false);

          //calling the needed DOM
          var listItems = document.querySelectorAll("#main ul li");

          //the fuction to carry out the actual scroll effect
          function scrolling(e) {
            for (var i = 0; i < listItems.length; i++) {
              var listItem = listItems[i];

              if (isPartiallyVisible(listItem)) {
                listItem.classList.add("active");
              } else {
                listItem.classList.remove("active");
              }
            }
          }

          //function to know when the element is visible
          function isPartiallyVisible(el) {
            var elementBoundary = el.getBoundingClientRect();

            var top = elementBoundary.top;
            var bottom = elementBoundary.bottom;
            var height = elementBoundary.height;

            return top + height >= 0 && height + window.innerHeight >= bottom;
          }
        })
      );
  });
