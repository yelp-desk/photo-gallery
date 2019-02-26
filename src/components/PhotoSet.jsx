import React, { useState, useEffect } from 'react';
function PhotoSet(props) {
  const [expandedNum, updateExpandedNum] = useState(1);

  useEffect(() => { //Manages which photo receives the hoverEffect based on the num on expandedNum
    let main = document.getElementsByClassName(`photoContainer ${expandedNum}`);
    if (main.length > 0) {
      let old = document.getElementsByClassName('hoverEffect');
      while (old.length > 0) {
        old[0].classList.remove('hoverEffect');
      }
      for (var i = 0; i < main.length; i++) {
        main[i].classList.add('hoverEffect');
      }
    }
  }, [expandedNum])

  function expandElement(event) { //Triggers on mouseover
    let target = event.target
    target.removeAttribute('style');
    let photoNum = target.className;
    photoNum = photoNum.slice(photoNum.length - 1, photoNum.length);
    if (Number(photoNum) !== expandedNum) { //Doesn't change anything if mouse is over currently expanded element
      updateExpandedNum(Number(photoNum));
    }
  }

  function shrinkElement() { //Triggers on mouseLeave - 1 is expanded by default
    updateExpandedNum(1);
  }


  let photoContainerClass = `photoContainer ${props.index}`

  return (
    <div className={photoContainerClass} onMouseEnter={expandElement} onMouseLeave={shrinkElement}>
      <div className={`imageContainer ${props.index}`}>
        <img className={`mainPhoto ${props.index}`} src={props.photo.img}></img>
      </div>
      <div className={`photoOverlay ${props.index}`}>
        <img className={`avatar ${props.index}`} src={props.photo.posterInfo.avatar}></img>
        <span className={`photoCaption ${props.index}`}>{props.photo.caption} by <strong className={`${props.index}`}>{props.photo.posterInfo.username}</strong></span>
      </div>
    </div>
  )
}

export default PhotoSet;