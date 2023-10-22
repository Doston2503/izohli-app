import React from 'react';
import {formatDate} from "../src/utils/constants";

function MainWord({dayWords}) {
    return (
        <div className="main-word-component">
            <div className="content-header">
                <div className="title">
                    <div className="word-name">
                        KUN SO’ZI
                        <span>{formatDate(dayWords?.date)}</span>
                    </div>
                    {/*<div className="voice-image">
                        <img src="/images/voice.svg" alt="" />
                    </div>*/}
                </div>
                <div className="text">{dayWords?.words?.label}</div>
                <div className="text-accent">
                    [ {dayWords?.words?.transcript} ] <i>{dayWords?.words?.categoryName}</i>
                    {/*<img src="/images/star.svg" alt="" />*/}
                </div>
                <div className="btn-group">
                    <button><a target="_blank" href="https://imlo.uz/">Imlosi</a></button>
                    <button><a target="_blank" href="https://sinonim.uz/">Senonimlari</a></button>
                </div>
            </div>

            <hr />

            {dayWords?.words?.notes?.map((item,index)=>(
                <div className="content-body" key={index}>
                    <span>{index+1}. {item?.titles}</span>
                    {item?.descriptions ? item?.descriptions+',':''} <i>{item?.sources}</i>
                    {/* <Link href={'#'} className="more-text">
                    Batafsil
                </Link>*/}
                </div>
            ))}

        </div>
    );
}

export default MainWord;
