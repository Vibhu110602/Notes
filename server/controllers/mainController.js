exports.homepage=async(req,res)=> {
    const locals={
        title:"Notes For You",
        descreption:"Free Notes NodeJs App"
    };
    res.render('index',{
        locals,
        layout:'../views/layouts/front-page'
    });
}

exports.about=async(req,res)=> {
    const locals={
        title:"About - Notes",
        descreption:"Free Notes NodeJs App"
    };
    res.render('about',locals);
}