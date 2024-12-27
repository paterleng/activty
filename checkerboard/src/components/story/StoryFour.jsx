import './Story.css';
import Header from "../header/Header.jsx";

const StoryFour = () => {
    return (
        <div className='four-div' style={{position: 'relative'}}>
            <Header/>
            <div className="four-div-main-external">
                <div className='four-div-main-internal'>
                    <div className='four-div-left'>
                        <div className='four-div-left-title'>Tokenomics</div>
                        <div className='four-div-left-contant'>
                            <p>
                                As a tenacious little hero, Chico has decided to share the treasures he bravely
                                reclaimed—the magical bones from the glowing pit!
                            </p>
                            <p>
                                These bones are precious, and Chico is all about fairness. So, all tokens will belong to
                                the community, which is A carnival between players and the community, 100% Fairlaunch
                                MEME Project.
                            </p>
                            <p>
                                But here's the twist: While the 100% goes to the community, the project team is also
                                playing the game, staking 100 SOL as liquidity. However, the final share of the LP is
                                unknown... Who will control the pit? That's still a mystery! It's a wild ride, and only
                                the brave will reap the rewards. Let the bone-sharing adventure begin!
                            </p>
                        </div>
                    </div>
                    <div className='four-div-right'>
                        <svg width="500" height="600" viewBox="0 0 524 621" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <rect y="106" width="515" height="515" rx="257.5" fill="url(#paint0_radial_0_1)"/>
                            <rect x="31" y="137" width="453" height="453" rx="226.5" fill="url(#paint1_radial_0_1)"/>
                            <circle cx="257.668" cy="361.667" r="230" fill="url(#paint2_radial_0_1)"
                                    fill-opacity="0.5"/>
                            <path
                                d="M258 206C207.6 239.6 140.4 254 90 254C90 371.6 140.4 491.6 258 542C375.6 491.6 426 371.6 426 254C375.6 254 308.4 239.6 258 206Z"
                                fill="white" fill-opacity="0.47" stroke="#ACDAD3" stroke-opacity="0.49"
                                stroke-width="1.33333" stroke-miterlimit="10" stroke-linecap="square"/>
                            <path
                                d="M280.273 307.302L205.97 380.05C205.97 380.05 188.972 395.465 174.48 395.465C159.989 395.465 157.163 416.748 162.518 421.99C167.872 427.233 181.407 422.593 187.582 422.593C193.757 422.593 200.82 423.217 200.82 429.999C200.82 436.781 196.4 459 208.362 459C220.324 459 232.31 450.992 232.31 438.655C232.31 426.318 227.274 411.527 245.525 393.636C263.776 375.744 304.084 326.443 304.084 326.443C304.084 326.443 313.54 318.411 322.996 320.263C332.452 322.115 345.644 320.888 351.956 312.879C358.267 304.87 357.63 287.604 346.92 287.604C336.211 287.604 322.996 298.758 322.996 291.284C322.996 283.811 325.502 258 309.119 258C292.737 258 282.05 266.008 282.05 277.72C282.05 289.432 288.157 299.605 280.273 307.302Z"
                                fill="white" fill-opacity="0.55"/>
                            <path d="M515.781 92.4599L275.561 315.822L390.368 8.55071L515.781 92.4599Z" fill="#B35649"
                                  stroke="url(#paint3_linear_0_1)" stroke-width="10"/>
                            <defs>
                                <radialGradient id="paint0_radial_0_1" cx="0" cy="0" r="1"
                                                gradientUnits="userSpaceOnUse"
                                                gradientTransform="translate(257.5 363.5) rotate(90) scale(257.5)">
                                    <stop offset="0.815"/>
                                    <stop offset="1" stop-color="#3C342F"/>
                                </radialGradient>
                                <radialGradient id="paint1_radial_0_1" cx="0" cy="0" r="1"
                                                gradientUnits="userSpaceOnUse"
                                                gradientTransform="translate(257.5 363.5) rotate(90) scale(226.5)">
                                    <stop offset="0.485" stop-color="#B35649"/>
                                    <stop offset="1" stop-color="#3C342F"/>
                                </radialGradient>
                                <radialGradient id="paint2_radial_0_1" cx="0" cy="0" r="1"
                                                gradientUnits="userSpaceOnUse"
                                                gradientTransform="translate(313.118 263.1) rotate(95.9188) scale(338.587)">
                                    <stop offset="0.02" stop-color="#EDF9F7"/>
                                    <stop offset="0.23" stop-color="#B4E4DC"/>
                                    <stop offset="0.515" stop-color="#32C2A8"/>
                                    <stop offset="1" stop-color="#B4E4DC"/>
                                </radialGradient>
                                <linearGradient id="paint3_linear_0_1" x1="313.256" y1="89.6936" x2="470.2" y2="194.699"
                                                gradientUnits="userSpaceOnUse">
                                    <stop/>
                                    <stop offset="1" stop-color="#666666"/>
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className='four-div-right-buttom-div'>
                            <div className='four-div-right-buttom-div-one'>90% +</div>
                            <div className='four-div-right-buttom-div-two'>Community</div>
                        </div>
                        <div className='four-div-right-top-div'>
                            <div className='four-div-right-top-div-one'>2%</div>
                            <div className='four-div-right-top-div-two'>Liquidity</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default StoryFour;



