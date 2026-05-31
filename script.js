body{
    margin:0;
    padding:0;
    background:#000;
    color:#fff;
    font-family:Arial,Helvetica,sans-serif;
    overflow-x:hidden;
}

.page-wrap{
    width:100%;
    min-height:100vh;
    padding-bottom:80px;
}

.title{
    text-align:center;
    font-size:56px;
    font-weight:900;
    color:#ffffff;
    margin-top:10px;
    margin-bottom:10px;
}

#hkClock{
    text-align:center;
    color:#ffff00;
    font-size:34px;
    font-weight:900;
    margin-bottom:35px;
}

.top-row{
    display:flex;
    justify-content:space-around;
    align-items:flex-start;
    flex-wrap:wrap;
}

.bottom-row{
    display:flex;
    justify-content:center;
    align-items:flex-start;
    gap:220px;
    margin-top:80px;
    flex-wrap:wrap;
}

.coin-box{
    width:24%;
    min-width:280px;
    display:flex;
    flex-direction:column;
    align-items:center;
    text-align:center;
}

.coin-title{
    font-size:18px;
    font-weight:bold;
    color:#ffffff;
    margin-bottom:6px;
}

.input-row{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:8px;
    margin-bottom:18px;
}

.input-row input{
    width:90px;
    height:24px;

    background:#111111;
    color:#ffffff;

    border:1px solid #444444;

    text-align:center;
    font-size:16px;
}

.input-row input:focus{
    outline:none;
    border:1px solid #00c853;
}

.input-row button{
    width:42px;
    height:26px;

    background:#00c853;
    color:#ffffff;

    border:1px solid #00c853;

    font-size:12px;
    font-weight:bold;

    cursor:pointer;
}

.input-row button:hover{
    background:#00e676;
}

.price{
    font-size:28px;
    font-weight:900;

    color:#ffffff;

    white-space:nowrap;
    overflow:visible;

    margin-top:5px;
    margin-bottom:22px;
}

.move{
    font-size:22px;
    font-weight:bold;
    margin-bottom:16px;
}

.pic{
    font-size:18px;
    font-weight:bold;
    line-height:1.5;
}

.up{
    color:#00ff99;
}

.down{
    color:#ff5555;
}

.normal{
    color:#ffff00;
}

@media screen and (max-width:1400px){

    .price{
        font-size:24px;
    }

    .coin-box{
        min-width:240px;
    }
}

@media screen and (max-width:1200px){

    .top-row{
        flex-direction:column;
        align-items:center;
        gap:50px;
    }

    .bottom-row{
        flex-direction:column;
        align-items:center;
        gap:50px;
        margin-top:50px;
    }

    .coin-box{
        width:95%;
        min-width:0;
    }

    .title{
        font-size:42px;
    }

    #hkClock{
        font-size:28px;
    }

    .price{
        font-size:22px;
    }
}
