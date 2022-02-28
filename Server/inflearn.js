const axios = require("axios");
const cheerio = require("cheerio");

const getHTML = async(keyword)=>{
    try {
        return await axios.get("https://news.etnews.com/"+encodeURI(keyword));
    } catch (err) {
        console.log(err);
    }
}

const parsing = async (keyword) =>{
    const html = await getHTML(keyword);
    const $ = cheerio.load(html.data);

    let s



    const $courseList = $(".grid");
    
    let infomation = [];
    $courseList.each((idx, node) => {
        
        if($(node).find("strong > a").text().length >0){
            infomation.push({
                title : $(node).find("strong > a").text(),
                text  : $(node).find("p > a").text(),
                link  : $(node).find("p > a").attr("href"),
                img   : $(node).find(".imgholder > a > img").attr("src")
            });
        }       
    });

    console.log(infomation);
}

parsing("");