var texts = [],
    clickAG = false, idClickedA, clkIds = [], clkA, clkRect, clkLine;

function author_dblclick_ABG(d){
    suggestion = d
    var isIn = false
    idA_rev = suggestion.id
    var aName = suggestion.value
    if(authsReview.includes(idA_rev))
        isIn = true
    else{
        authsReview.push(idA_rev)
        authsReview_obj.push(suggestion)
        $("#rauthList").append("<li id=\"a"+idA_rev+"\" class=\"list-group-item pAuth pAuthr\"><strong>"+authsReview.length+".</strong> "+suggestion.value+" <a target=\"_blank\" class=\"dblp links\" href=\"https://dblp.uni-trier.de/search?q="+suggestion.value.split(' ').join('+')+"\">dblp</a></li>")
        authorBars()
        authorGraph()
    }
    popTextA.style("opacity", 0)
    popRectA.style("opacity",0)
    d3.select(".txtspan").remove()
}

function unclick_auth(d){
    idClickedA = 0;
        clkIds= [];
        clkA = null;
        clkRect.attr("stroke-width",0)
        clkRect = null;
        clkLine = null;
    click = false;
    reset_texts()
    d3.selectAll(".plink").style("opacity", 1)
    d3.selectAll(".papersNode")
        .style("opacity", 1)
        .attr("r", 6)
        .attr("stroke", function(d){
                    if(idPs.includes(d.id))
                        return "#4238ff"
                        //return "#6d10ca";
                    else return "#999";
                    })
        .attr("stroke-width", function(d){
            if(idPs.includes(d.id))
                return 2.5;
            })
    popRectA.style("opacity", 0)
    popTextA.style("opacity", 0)
    d3.select(".txtspan").remove()
    d3.selectAll(".aglink")
        .style("opacity", 1)   
        .style("pointer", "cursor")
    d3.selectAll(".authors-dot")
        .attr("r", a_radius)
        .style("opacity", 1)
        .style("pointer", "cursor")
    d3.selectAll(".authlLine")
        .style('stroke',function (d){
                    if(!(authsExclude.includes(d.id) || authsReview.includes(d.id)) && (authColor(d) || authColor_r(d)))
                        return "rgba( 188, 188, 188, 0.454 )"
                    else
                        return "rgba( 221, 167, 109, 0.342 )"
                })
        .style("opacity", 1)
        .style("pointer", "cursor")
    d3.selectAll(".authNode")
        .attr('fill', function (d){
                if((authColor(d) || authColor_r(d)) && !(authsExclude.includes(d.id) || authsReview.includes(d.id) ))
                    return "rgba( 188, 188, 188, 0.454 )"
                else
                    return "rgba( 221, 167, 109, 0.342 )"
            })
        .style("opacity", 1)
        .style("pointer", "cursor")
    d3.selectAll(".auth-name")
        .style("opacity", 1)
    d3.selectAll(".paper_in_bars").style("opacity", 1)
}

function reclick_auth(d){
    reset_texts()
    d3.selectAll(".papersNode")
        .style("opacity", function(d1){
            var al = d1.authsId,
                all = al.length, found = false, i = 0;
            if(!al.includes(d.id)) return 0.2;
            while( !found && i < all ){
                found = (idAs.includes(al[i]) && d.coAuthList[al[i]]) ? true : false;
                i++
            }
            if(found){
                papNameConflict(d1)
                return 1;
            }else return 0.2;
        })
        .attr("r",  function(d1){
            var al = d1.authsId,
                all = al.length, found = false, i = 0;
            if(!al.includes(d.id)) return 6;
            while( !found && i < all ){
                found = (idAs.includes(al[i]) && d.coAuthList[al[i]]) ? true : false;
                i++
            }
            return found ? 9 : 6;
        })
    //mostra autori conflittati in AG e AB
    d3.selectAll(".paper_in_bars").style("opacity", function(d1){
            var al = d1.authsId,
                    all = al.length, found = false, i = 0;
                if(!al.includes(d.id)) return 0;
                while( !found && i < all ){
                    var t = authsDef.filter(function(el){return el.id === al[i]})
                    found = ( al[i]!= d.id && t.length > 0) ? true : false;
                    i++
                }
            return found ? 1: 0;
        })
//        d3.selectAll(".p"+d.id).style("opacity", function(d1){
//                var al = d1.authsId,
//                    all = al.length, found = false, i = 0;
//                if(!al.includes(d.id)) return 0;
//                while( !found && i < all ){
//                    found = !(al[i] === d.id) && idAs.includes(al[i]) && d.coAuthList[al[i]] && checkThetaNC(d, al[i]) ? true : false;
//                    i++
//                }
//                return found ? 1 : 0;
//            })
    d3.selectAll(".aglink")
        .style("opacity", function(d1){ return ((d1.source.id === d.id || d1.target.id === d.id) && idAs.includes(d1.source.id) && idAs.includes(d1.target.id) && checkThetaNC(d1.source, d1.target.id)) ?  1 : 0; })

    d3.selectAll(".authors-dot")
        .style("opacity", function(d1){ return d1.id === d.id || (idAs.includes(d1.id) && d.coAuthList[d1.id]) && checkThetaNC(d, d1.id) ?  1 : 0; })
    d3.selectAll(".authlLine")
        .style('stroke', function(d1){ return d1.id === d.id || (idAs.includes(d1.id) && d.coAuthList[d1.id]) && checkThetaNC(d, d1.id) ?  "rgba( 188, 188, 188, 0.454 )" : "rgba( 251, 197, 125, 0.83 )"; })
        .style("opacity", function(d1){ return d1.id === d.id || (idAs.includes(d1.id) && d.coAuthList[d1.id]) && checkThetaNC(d, d1.id) ?  1 : 0; })
    d3.selectAll(".authNode")
        .attr("fill", function(d1){ return d1.id === d.id || (idAs.includes(d1.id) && d.coAuthList[d1.id] ) && checkThetaNC(d, d1.id) ?  "rgba( 188, 188, 188, 0.454 )" : "rgba( 251, 197, 125, 0.83 )"; })
        .style("opacity", function(d1){ return d1.id === d.id || (idAs.includes(d1.id) && d.coAuthList[d1.id]) && checkThetaNC(d, d1.id) ?  1 : 0; })
//        d3.selectAll(".auth-name")
//            .style("opacity", function(d1){ return d1.id === d.id || (idAs.includes(d1.id) && d.coAuthList[d1.id]) && checkThetaNC(d, d1.id) ?  1 : 0; })   
    d3.selectAll(".auth-name")
        .style("opacity", function(d1){ if(d1.id === d.id || (idAs.includes(d1.id) && d.coAuthList[d1.id]) && checkThetaNC(d, d1.id)){
                return 1;
            }else{
                d3.selectAll(".p"+d1.id).style("opacity", 0)
                return 0;} })   
}

function authClickHandler(d){
    
    if(idAs.includes(d.id)){
    if(click){
        unclick_auth(d)
    }else{
        //console.log("clickA")
        clkRect = d3.select("#aa"+d.id)
            .attr("stroke", "rgba( 27, 222, 252, 1 )")
            .attr("stroke-width", 2)
        reset_texts()
        simulation.stop()
        simulationA.stop()
        click = true;
        clkA = d;
        idClickedA = d.id;
        d3.selectAll(".plink").style("opacity", 0.2)
        d3.selectAll(".papersNode")
            .style("opacity", function(d1){
                var al = d1.authsId,
                    all = al.length, found = false, i = 0;
                if(!al.includes(d.id)) return 0.2;
                while( !found && i < all ){
                    found = ( al[i]!= d.id && idAs.includes(al[i]) && d.coAuthList[al[i]]) ? true : false;
                    i++
                }
                if(found){
                    papNameConflict(d1)
                    return 1;
                }else return 0.2;
            })
            .attr("r",  function(d1){
                var al = d1.authsId,
                    all = al.length, found = false, i = 0;
                if(!al.includes(d.id)) return 6;
                while( !found && i < all ){
                    found = (al[i]!= d.id && idAs.includes(al[i]) && d.coAuthList[al[i]]) ? true : false;
                    i++
                }
                return found ? 9 : 6;
            })
        click = true;
        //mostra autori conflittati in AG e AB
        d3.selectAll(".aglink")
            .style("opacity", function(d1){ return ((d1.source.id === d.id || d1.target.id === d.id) && idAs.includes(d1.source.id) && idAs.includes(d1.target.id) && checkThetaNC(d1.source, d1.target.id)) ?  1 : 0; })

        d3.selectAll(".authors-dot")
            .style("opacity", function(d1){ if(d1.id === d.id || (idAs.includes(d1.id) && d.coAuthList[d1.id]) && checkThetaNC(d, d1.id)){
                    clkIds.push(d1.id);
                    return 1;
                }else{
                    return 0;} })
            .attr("r", a_radius)
        //DA SISTEMARE ANCHE IN ALTRI HANDLER
        d3.selectAll(".paper_in_bars").style("opacity", function(d1){
            var al = d1.authsId,
                    all = al.length, found = false, i = 0;
                if(!al.includes(d.id)) return 0;
                while( !found && i < all ){
                    var t = authsDef.filter(function(el){return el.id === al[i]})
                    found = ( al[i]!= d.id && t.length > 0) ? true : false;
                    i++
                }
            return found ? 1: 0;
        })
        d3.selectAll(".authlLine")
            .style('stroke', function(d1){ return d1.id === d.id || (idAs.includes(d1.id) && d.coAuthList[d1.id]) && checkThetaNC(d, d1.id) ?  "rgba( 188, 188, 188, 0.454 )" : "rgba( 251, 197, 125, 0.83 )"; })
            .style("opacity", function(d1){ return d1.id === d.id || (idAs.includes(d1.id) && d.coAuthList[d1.id]) && checkThetaNC(d, d1.id) ?  1 : 0; })
        d3.selectAll(".authNode")   
            .attr("fill", function(d1){ return d1.id === d.id || (idAs.includes(d1.id) && d.coAuthList[d1.id] ) && checkThetaNC(d, d1.id) ?  "rgba( 188, 188, 188, 0.454 )" : "rgba( 251, 197, 125, 0.83 )"; })
            .style("opacity", function(d1){ 
                if(d1.id === d.id || (idAs.includes(d1.id) && d.coAuthList[d1.id]) && checkThetaNC(d, d1.id)){
                    return 1;
                }
                else{
                    d3.selectAll(".p"+d1.id).style("opacity", 0)
                    return 0;
                   }
            })
//        d3.selectAll(".auth-name")
//            .style("opacity", function(d1){ return d1.id === d.id || (idAs.includes(d1.id) && d.coAuthList[d1.id]) && checkThetaNC(d, d1.id) ?  1 : 0; })   
                d3.selectAll(".auth-name")
            .style("opacity", function(d1){ if(d1.id === d.id || (idAs.includes(d1.id) && d.coAuthList[d1.id]) && checkThetaNC(d, d1.id)){
                    return 1;
                }else{
                    d3.selectAll(".p"+d1.id).style("opacity", 0)
                    return 0;} })   
    }}
}

function handlerMouseOverA(d){ 
    if(!click){
    reset_texts()
    //if(click) unclick_auth();
    d3.selectAll(".plink")
        .style("opacity", 0.2)
    
    d3.selectAll(".papersNode")
        .style("opacity", function(d1){
            if(d1.authsId.includes(d.id))
                return 1;
            else
                return 0.2;
        })
        .attr("r", function(d1){
            if(d1.authsId.includes(d.id))
                return "9";
            else return "6";
        })
        .attr("stroke", function(d1){
            if(d1.authsId.includes(d.id))
                return "#d08701";
            else
                if(idPs.includes(d1.id))                    
                    return "#4238ff"
                    //return "#6d10ca";
                else
                    return "#999";
            })
        .attr("stroke-width", function(d1){
            if(d1.authsId.includes(d.id)){
                papName(d1)
                return 3.5;
            }
            else
                if(idPs.includes(d1.id))                    
                    return 2.5;
            })
         d3.select("#aa"+d.id)
        .transition().duration(200)
        .attr('fill',"rgba( 138, 223, 223, 0.569 )")

    d3.select("#aaline"+d.id)
        .transition().duration(200)
        .style('stroke',"rgba( 138, 223, 223, 0.569 )")
    
    d3.select("#ag"+d.id)
        .transition().duration(200)
        .attr("r", 7)
    }
    else if(d.id != idClickedA && clkIds.includes(d.id)){
        reset_texts()
        d3.selectAll(".papersNode")
            .style("opacity", function(d1){
                var al = d1.authsId;
                return al.includes(d.id) && al.includes(idClickedA) ? 1 : 0;
            })
            .attr("r",  function(d1){
                var al = d1.authsId, found = al.includes(d.id) && al.includes(idClickedA);
                if (found) papNameConflict(d1);
                return found ? 9 : 6;
            })
        //mostra autori conflittati in AG e AB
        d3.selectAll(".paper_in_bars").style("opacity", function(d1){
            var al = d1.authsId;
            return al.includes(d.id) && al.includes(idClickedA) ? 1:0;
        })
        d3.selectAll(".aglink")
            .style("opacity", function(d1){ 
                if((d1.source.id === d.id || d1.target.id === d.id) 
                   && (d1.source.id === idClickedA || d1.target.id 
                    === idClickedA)) {
                        var txt = clkA.value + " - " + d.value
                        popTextA.text(txt)
                        var el   = document.getElementById("svgAG_names");
                        var rect = el.getBoundingClientRect(); // get the bounding rectangle

                        var bbox = popTextA.node().getBBox();
                        var wd = bbox.width,
                            ht = bbox.height;
                        //popRect.attr('fill', color(d.color))
                        popTextA.attr("x", function(){
                            let ret = rect.width - wd - 28;
                            //console.log("ret "+ret+ "wd "+wd+" ht "+ht)
                            return ret;})
                            .attr("y", 20)
                            .style("opacity", 1)
                        popTextA.append('svg:tspan')
                            .attr("class", "txtspan")
                          .attr('x', function(){
                            let ret = rect.width - wd - 28;
                            return ret;})
                          .attr('dy', 20)
                          .text(function() {
                            return d1.value + " shared papers"; })
                            .append('svg:tspan')
                            .attr("class", "txtspan")
                          .attr('x', function(){
                            let ret = rect.width - wd - 28;
                            return ret;})
                          .attr('dy', 20)
                          .text(function() {
                            var shared_in_viz = papersFiltered.filter(function (el){
                                    return el.authsId.includes(idClickedA) && el.authsId.includes(d.id);
                                })
                            return shared_in_viz.length+" visualized"; })
                        popRectA.attr("x", function(){return rect.width - wd - 33})
                            .attr('y',5)
                            .attr('width',function(){return wd + 10})
                            .attr('height',function(){return 3*ht + 17})
                            .style('opacity',1)
                        return  1 
                    } else return 0; })
        d3.selectAll(".authors-dot")
            .style("opacity", function(d1){ return d1.id === d.id || d1.id === idClickedA ?  1 : 0; })
        d3.selectAll(".authNode")
            .style("opacity", function(d1){ return d1.id === d.id || d1.id === idClickedA ? 1 : 0; })
        d3.selectAll(".authlLine")
            .style('opacity', function(d1){ return d1.id === d.id || d1.id === idClickedA ?  1:0; })
        d3.selectAll(".auth-name")
            .style("opacity", function(d1){ 
                if(d1.id === d.id || d1.id === idClickedA){
                    return 1;
                }else{
                        d3.selectAll(".p"+d1.id).style("opacity", 0)
                        return 0;
                }})  
        
    }
}

function handlerMouseOutA(d){
   if(!click){     
    reset_texts()
    //if(click) unclick_auth();
    d3.select("#aa"+d.id).transition().duration(200).attr('fill', function (d){
        if((authColor(d) || authColor_r(d)) && !(authsExclude.includes(d.id) || authsReview.includes(d.id) ))
            return "rgba( 188, 188, 188, 0.454 )"
        else
            return "rgba( 221, 167, 109, 0.342 )"
    })

   d3.select("#ag"+d.id)
        .transition().duration(200)
        .attr("r", a_radius) 
    d3.select("#aaline"+d.id).transition().duration(200).style('stroke',function (d){
                    if(!(authsExclude.includes(d.id) || authsReview.includes(d.id)) && (authColor(d) || authColor_r(d)))
                        return "rgba( 188, 188, 188, 0.454 )"
                    else
                        return "rgba( 221, 167, 109, 0.342 )"
                })

    d3.selectAll(".plink")
        .transition().duration(200)
        .style("opacity", 1)
    d3.selectAll(".papersNode")
        .transition().duration(200)
        .attr("r", "6")
        .style("opacity", 1)
        .attr("stroke", function(d1){
            if(d1.authsId.includes(d.id))
                d3.select($("#txt"+d1.id)[0])
                    .attr("x", -1000)
                    .attr("y", -1000)
                    .attr("opacity", 0)  
            if(idPs.includes(d1.id))
                return "#4238ff"
                //return "#6d10ca";
            else return "#999";
            })
        .attr("stroke-width", function(d1){
            if(idPs.includes(d1.id))
                return 2.5;
            })
   }else if(d.id != idClickedA) {
        popTextA.style("opacity", 0)
        popRectA.style('opacity',0)
        d3.select(".txtspan").remove()
        reclick_auth(authsDef.filter(function (el){ return el.id === idClickedA;})[0])
   } 
}

function handlerMouseOverAG(d){
    if(!click){
        reset_texts()
        d3.select(this).transition()
            .duration(200)
            .attr("r", 7);

        var txt = d.value

        popTextA.text(txt)
        var el   = document.getElementById("svgAG_names");
        var rect = el.getBoundingClientRect(); // get the bounding rectangle

        var bbox = popTextA.node().getBBox();
        var wd = bbox.width,
            ht = bbox.height;
        //popRect.attr('fill', color(d.color))
        popTextA.attr("x", function(){
            let ret = rect.width - wd - 28;
            //console.log("ret "+ret)
            return ret;})
            .attr("y", 20)
            .style("opacity", 1)

        popRectA.attr("x", function(){return rect.width - wd - 33})
            .attr('y',5)
            .attr('width',function(){return wd + 10})
            .attr('height',function(){return ht + 5})
            .style('opacity',1)

        d3.select("#aa"+d.id)
            .transition().duration(200)
            .attr('fill',"rgba( 138, 223, 223, 0.569 )")

        d3.select("#aaline"+d.id)
            .transition().duration(200)
            .style('stroke',"rgba( 138, 223, 223, 0.569 )")

       /*histogram paper for each author

        addPaper(){
        resetAllValues
        ...
        for each author
            counter paper per year
        ...
        }

        d3.select("#svgA"+d.id)
            .append("rect")
            //.attr("id", function (d){ return "aa"+d.id})
            //.attr("class", "authNode")
            .attr('x',function(d){
                let nw = xConstrained(authDict[d.id][1]),
                    od = xConstrained(authDict[d.id][0]);
                if(od!=nw)return od;
                else return od-2;
            })
            .attr('y',4)
            .attr('width',function(d){
                let nw = xConstrained(authDict[d.id][1]),
                    od = xConstrained(authDict[d.id][0]);
                if(od!=nw)return nw-od;
                else return 4;
            })
            .attr('height', "5px")
            .attr("fill", "#df1414")
        */

        d3.selectAll(".plink")
            .style("opacity", 0.2)

        if(idAs.includes(d.id)) {   
        d3.selectAll(".papersNode")
            .style("opacity", function(d1){
                if(d1.authsId.includes(d.id))
                    return 1;
                else
                    return 0.2;
            })
            .attr("r", function(d1){
                if(d1.authsId.includes(d.id))
                    return "9";
                else return "6";
            })
            .attr("stroke", function(d1){
                if(d1.authsId.includes(d.id))
                    return "#d08701";
                else
                    if(idPs.includes(d1.id))
                        return "#4238ff"
                        //return "#6d10ca";
                    else
                        return "#999";
                })
            .attr("stroke-width", function(d1){
                if(d1.authsId.includes(d.id)){
                    papName(d1)
                    return 3.5;
                }
                else
                    if(idPs.includes(d1.id))                    
                        return 2.5;
                })
        }
    }
    else if(d.id != idClickedA && clkIds.includes(d.id)){
        reset_texts()
        d3.selectAll(".papersNode")
            .style("opacity", function(d1){
                var al = d1.authsId;
                return al.includes(d.id) && al.includes(idClickedA) ? 1 : 0;
            })
            .attr("r",  function(d1){
                var al = d1.authsId, found = al.includes(d.id) && al.includes(idClickedA);
                if (found) papNameConflict(d1);
                return found ? 9 : 6;
            })
        //mostra autori conflittati in AG e AB
        d3.selectAll(".paper_in_bars").style("opacity", function(d1){
            var al = d1.authsId;
            return al.includes(d.id) && al.includes(idClickedA) ? 1:0;
        })
        d3.selectAll(".aglink")
            .style("opacity", function(d1){ 
                if((d1.source.id === d.id || d1.target.id === d.id) 
                   && (d1.source.id === idClickedA || d1.target.id 
                    === idClickedA)) {
                        var txt = clkA.value + " - " + d.value
                        popTextA.text(txt)
                        var el   = document.getElementById("svgAG_names");
                        var rect = el.getBoundingClientRect(); // get the bounding rectangle

                        var bbox = popTextA.node().getBBox();
                        var wd = bbox.width,
                            ht = bbox.height;
                        //popRect.attr('fill', color(d.color))
                        popTextA.attr("x", function(){
                            let ret = rect.width - wd - 28;
                            //console.log("ret "+ret+ "wd "+wd+" ht "+ht)
                            return ret;})
                            .attr("y", 20)
                            .style("opacity", 1)
                        popTextA.append('svg:tspan')
                            .attr("class", "txtspan")
                          .attr('x', function(){
                            let ret = rect.width - wd - 28;
                            return ret;})
                          .attr('dy', 20)
                          .text(function() {
                            return d1.value + " shared papers"; })
                            .append('svg:tspan')
                            .attr("class", "txtspan")
                          .attr('x', function(){
                            let ret = rect.width - wd - 28;
                            return ret;})
                          .attr('dy', 20)
                          .text(function() {
                            var shared_in_viz = papersFiltered.filter(function (el){
                                    return el.authsId.includes(idClickedA) && el.authsId.includes(d.id);
                                })
                            return shared_in_viz.length+" visualized"; })
                        popRectA.attr("x", function(){return rect.width - wd - 33})
                            .attr('y',5)
                            .attr('width',function(){return wd + 10})
                            .attr('height',function(){return 3*ht + 17})
                            .style('opacity',1)
                        return  1 
                    } else return 0; })
        d3.selectAll(".authors-dot")
            .style("opacity", function(d1){ return d1.id === d.id || d1.id === idClickedA ?  1 : 0; })
        d3.selectAll(".authNode")
            .style("opacity", function(d1){ return d1.id === d.id || d1.id === idClickedA ? 1 : 0; })
        d3.selectAll(".authlLine")
            .style('opacity', function(d1){ return d1.id === d.id || d1.id === idClickedA ?  1:0; })
        d3.selectAll(".auth-name")
            .style("opacity", function(d1){ 
                if(d1.id === d.id || d1.id === idClickedA){
                    return 1;
                }else{
                        d3.selectAll(".p"+d1.id).style("opacity", 0)
                        return 0;
                }})  
        
    }
}

function handlerMouseOutAG(d){
    if(!click){
       //unclick_auth();
        d3.select(this).transition()
            .duration(200)
            .attr("r", a_radius);
        d3.selectAll(".plink")
            .style("opacity", 1)
        popTextA.attr("width", 0)
            .attr("x", -5000)
            .style("opacity", 0);
        popRectA.attr("x", function(){return - 5000})
            .style('opacity',0)
        d3.select("#aa"+d.id).transition().duration(200).attr('fill', function (d){
                
                if((authColor(d) || authColor_r(d)) && !(authsExclude.includes(d.id) || authsReview.includes(d.id) ))
                    return "rgba( 188, 188, 188, 0.454 )"
                else
                    return "rgba( 221, 167, 109, 0.342 )"
            })
        d3.select("#aaline"+d.id).transition().duration(200)            .style('stroke',function (d){
                    if(!(authsExclude.includes(d.id) || authsReview.includes(d.id)) && (authColor(d) || authColor_r(d)))
                        return "rgba( 188, 188, 188, 0.454 )"
                    else
                        return "rgba( 221, 167, 109, 0.342 )"
                })
        reset_texts()
         d3.selectAll(".papersNode")
            .transition().duration(200)
            .attr("r", "6")
            .style("opacity", 1)
            .attr("stroke", function(d1){
                if(d1.authsId.includes(d.id))
                    d3.select($("#txt"+d1.id)[0])
                        .attr("x", -1000)
                        .attr("y", -1000)
                        .attr("opacity", 0)  
                if(idPs.includes(d1.id))
                    return "#4238ff"
                    //return "#6d10ca";
                else return "#999";
                })
            .attr("stroke-width", function(d1){
                if(idPs.includes(d1.id))
                    return 2.5;
                })
        popTextA.style("opacity", 0)

        popRectA.style("opacity",0)
    }
    else if(d.id != idClickedA) {
        popTextA.style("opacity", 0)
        popRectA.style('opacity',0)
        d3.select(".txtspan").remove()
        reclick_auth(authsDef.filter(function (el){ return el.id === idClickedA;})[0])
   } 
//    if(!click){
//        /*
//    popTextA.attr("width", 0)
//        .attr("x", -5000)
//        .attr("opacity", 0);
//    popRectA.attr("x", -5000)
//        .attr("width", 0)
//        .attr("opacity", 0);
//    d3.select(this).transition()
//        .duration(200)
//        .attr("width", 500);
//        */
//    d3.selectAll(".plink")
//        .style("opacity", 1)
//    d3.selectAll(".papersNode")
//        .attr("r", "6")
//        .style("opacity", 1)
//        .attr("stroke", function(d1){
//            if(d1.authsId.includes(d.id))
//                d3.select($("#txt"+d1.id)[0])
//                    .attr("x", -1000)
//                    .attr("y", -1000)
//                    .attr("opacity", 0)  
//            if(idPs.includes(d1.id))
//                return "#6d10ca";
//            else return "#999";
//            })
//        .attr("stroke-width", function(d1){
//            if(idPs.includes(d1.id))
//                return 2.5;
//            })
//    }
}

function linkAGClickHandler(d){
//show informative popup and hint shared viz papers
    if(!click){if(clickAG){
        reset_texts()
        clickAG = false;
        d3.selectAll(".plink").style("opacity", 1)
        d3.selectAll(".papersNode")
            .style("opacity", 1)
            .attr("r", 6)
        //d3.select(".txtspan").remove()
    }else{
        clickAG = true;    
        d3.selectAll(".plink").style("opacity", 0.2)
        d3.selectAll(".papersNode")
            .style("opacity", function(d1){
                if( checkThetaNC(d.source, d.target.id) && d.source.coAuthList[d.target.id][2].includes(d1.id))
                    return 1;
                else
                    return 0.2;
            })
            .attr("r", function(d1){
                if( checkThetaNC(d.source, d.target.id) &&  d.source.coAuthList[d.target.id][2].includes(d1.id)){
                    papName(d1)
                    return "9";}
                else return "6";
        })
    }}
}

function handlerMouseOverLinkAG(d){
    if(!click){
        reset_texts()
        if(clickAG) clickAG = false;
        d3.selectAll(".authors-dot").style("opacity", 0.2)
        d3.selectAll(".aglink").style("opacity", 0.2)

        d3.select("#ag"+d.source.id)
            .attr("r", 7)
            .style("opacity", 1)
        d3.select("#ag"+d.target.id)
            .attr("r", 7).style("opacity", 1)
        d3.select(this)
            .attr("stroke-width", 5).style("opacity", 1)

        var txt = d.source.value + " - " + d.target.value
        popTextA.text(txt)
        var el   = document.getElementById("svgAG_names");
        var rect = el.getBoundingClientRect(); // get the bounding rectangle

        var bbox = popTextA.node().getBBox();
        var wd = bbox.width,
            ht = bbox.height;
        //popRect.attr('fill', color(d.color))
        popTextA.attr("x", function(){
            let ret = rect.width - wd - 28;
            //console.log("ret "+ret+ "wd "+wd+" ht "+ht)
            return ret;})
            .attr("y", 20)
            .style("opacity", 1)
        popTextA.append('svg:tspan')
            .attr("class", "txtspan")
          .attr('x', function(){
            let ret = rect.width - wd - 28;
            return ret;})
          .attr('dy', 20)
          .text(function() {
            return d.value + " shared papers"; })
            .append('svg:tspan')
            .attr("class", "txtspan")
          .attr('x', function(){
            let ret = rect.width - wd - 28;
            return ret;})
          .attr('dy', 20)
          .text(function() {
            var shared_p = d.source.coAuthList[d.target.id][2],
                shared_in_viz = papersFiltered.filter(function (el){
                    return shared_p.includes(el.id);
                })
            return shared_in_viz.length+" visualized"; })

        popRectA.attr("x", function(){return rect.width - wd - 33})
            .attr('y',5)
            .attr('width',function(){return wd + 10})
            .attr('height',function(){return 3*ht + 17})
            .style('opacity',1)

        if(clickAG){
            reset_texts()
            d3.selectAll(".plink").style("opacity", 0.2)
            d3.selectAll(".papersNode")
                .style("opacity", function(d1){
                    if(d.source.coAuthList[d.target.id][2].includes(d1.id))
                        return 1;
                    else
                        return 0.2;
                })
                .attr("r", function(d1){
                    if(d.source.coAuthList[d.target.id][2].includes(d1.id)){
                        papName(d1)
                        return "9";
                    }
                    else return "6";
                })
        }
    }
}

function handlerMouseOutLinkAG(d){
    if(!click){
        reset_texts()
        if(clickAG) clickAG = false;
        d3.selectAll(".authors-dot").style("opacity", 1)
        d3.selectAll(".aglink").style("opacity", 1)
        d3.select("#ag"+d.source.id)
            .attr("r", a_radius)  
        d3.select("#ag"+d.target.id)
            .attr("r", a_radius)  
        popTextA.style("opacity", 0)
        popRectA.style('opacity',0)
        d3.select(this)
            .attr("stroke-width", function(d){
                if(idAs.includes(d.source) && idAs.includes(d.target) )
                    return d.value*0.15
                else return d.value*0.1})
        d3.select(".txtspan").remove()
        d3.selectAll(".plink").style("opacity", 1)
        d3.selectAll(".papersNode")
            .style("opacity", 1)
            .attr("r", 6)
    }
}

function handleMouseOver(d){ 
    if(!click){
        d3.select(this).transition()
            .duration(200)
            .attr("r", 10);
        var txt = d.value
        /*
        if(txt.length>80)
            txt = txt.substring(0,80)+"...";
        */
        popText.text(txt)
        var bbox = popText.node().getBBox();
        var wd = bbox.width,
            ht = bbox.height,
            x = this.cx.baseVal.value,
            y = this.cy.baseVal.value;
        popRect.attr('fill', color_n(d.color))
        //popRect.attr('fill', "rgba( 181, 181, 181, 1 )")
            .attr('width',wd +10)
            .attr('height',ht+2)
            .attr("x", getXRect(x, wd, true))
            .attr("y", y-8)
            .transition()
            .duration(200)
            .attr("opacity", 1)
        popText.attr("x", getXTxt(x, wd, true))
            .attr("y", y + 4)
            .transition()
            .duration(200)
            .attr("opacity", 1)

        d3.selectAll(".authNode")
            .transition().duration(200)
            .attr("fill", function(d1){ 
                if(d.authsId.includes(d1.id))
                    return color_n(d.color);
                else if((authColor(d1) || authColor_r(d1)) && !(authsExclude.includes(d1.id) || authsReview.includes(d1.id) ))
                    return "rgba( 188, 188, 188, 0.454 )"
                else
                    return "rgba( 221, 167, 109, 0.342 )"
            })
         d3.selectAll(".authlLine")
            .transition().duration(200)
            .style("stroke", function(d1){ 
                if(d.authsId.includes(d1.id))
                    return color_n(d.color);
                else if(!(authsExclude.includes(d1.id) || authsReview.includes(d1.id)) && (authColor(d1) || authColor_r(d1)))
                        return "rgba( 188, 188, 188, 0.454 )"
                    else
                        return "rgba( 221, 167, 109, 0.342 )"
                })
    }
}

function handleMouseOut(d){
    if(!click){
        popText.attr("width", 0)
            .attr("x", -5000)
            .attr("opacity", 0);
        popRect.attr("x", -5000)
            .attr("width", 0)
            .attr("opacity", 0);
        d3.select(this).transition()
            .duration(200)
            .attr("r", 6);
        d3.selectAll(".plink")
            .style("opacity", 0.8)
        d3.selectAll(".authNode")
            .transition().duration(200)
                        .attr('fill', function (d){
                
                if((authColor(d) || authColor_r(d)) && !(authsExclude.includes(d.id) || authsReview.includes(d.id) ))
                    return "rgba( 188, 188, 188, 0.454 )"
                else
                    return "rgba( 221, 167, 109, 0.342 )"
            })
        d3.selectAll(".authlLine")
            .transition().duration(200)
                       .style('stroke',function (d){
                    if(!(authsExclude.includes(d.id) || authsReview.includes(d.id)) && (authColor(d) || authColor_r(d)))
                        return "rgba( 188, 188, 188, 0.454 )"
                    else
                        return "rgba( 221, 167, 109, 0.342 )"
                })
    }
}

function clickHandler(d){
    if(click) unclick_auth(clkA)
    $('#paperInfo').html(paperInfo(d))
    setPapHandlers()
}

function handleMouseOverPB(d, event){ 
    if(!click){
        d3.select(this).transition()
            .duration(200)
            .attr("r", 4);

        var txt = d.value
        /*
        if(txt.length>80)
            txt = txt.substring(0,80)+"...";
        */
        if(papersPrint.includes(d.id)){
            popText.text(txt)
            var bbox = popText.node().getBBox();
            var wd = bbox.width,
                ht = bbox.height,
                pap = d3.select("#p"+d.id),
                x = pap.node().cx.baseVal.value,
                y = pap.node().cy.baseVal.value;
            popRect.attr('fill', color_n(d.color))
            //popRect.attr('fill', aolor_r(d.color))
                .attr('width',wd +10)
                .attr('height',ht+2)
                .attr("x", getXRect(x, wd, true))
                .attr("y", y-8)
                .transition()
                .duration(200)
                .attr("opacity", 1)
            popText.attr("x", getXTxt(x, wd, true))
                .attr("y", y + 4)
                .transition()
                .duration(200)
                .attr("opacity", 1)
            pap.transition()
                .duration(200)
                .attr("r", 10)
        }else{
            popTextAx.text(txt)
            var bbox = popTextAx.node().getBBox();
            var wd = bbox.width,
                ht = bbox.height,
                x = xConstrained(d.year) -wd/2,
                y = 50;
            //popRect.attr('fill', color(d.color))
            popRectAx.attr('fill', "rgba( 67, 230, 238)")
                .attr('width',wd +10)
                .attr('height',ht+2)
                .attr("x", getXRect(x, wd, false))
                .attr("y", y-8)
                .transition()
                .duration(200)
                .attr("opacity", 1)
            popTextAx.attr("x", getXTxt(x, wd, false))
                .attr("y", y + 4)
                .transition()
                .duration(200)
                .attr("opacity", 1)
        }
    }
}

function handleMouseOutPB(d){
    if(!click){
        d3.select(this).transition()
            .duration(200)
            .attr("r",function (d){
                return (idPs.includes(d.id) || papersPrint.includes(d.id)) ? 3: 2 })
        popText.attr("width", 0)
            .attr("x", -5000)
            .attr("opacity", 0);
        popRect.attr("x", -5000)
            .attr("width", 0)
            .attr("opacity", 0);
        popTextAx.attr("width", 0)
            .attr("x", -5000)
            .attr("opacity", 0);
        popRectAx.attr("x", -5000)
            .attr("width", 0)
            .attr("opacity", 0);
        if(papersPrint.includes(d.id)){
            d3.select("#p"+d.id).transition()
                .duration(200)
                .attr("r", 6);
        }
    }
}

function clickHandlerPB(d){
    if(click) unclick_auth(clkA)
    $('#paperInfo').html(paperInfo(d))
    setPapHandlers()
}

function addFromList(event){
    var idClick = event.target.id;
    
    if(!idClick)
        idClick = event.target.parentNode.id

    if(idClick[0]=='p'){
        idClick = idClick.substring(1,idClick.length);
        var paper = papers.filter(function (item){ return item.id === idClick})[0];
        if(!idPs.includes(idClick))
            addPaper(paper)
    }else{
        idClick = idClick.substring(1,idClick.length);
        if(idAs.includes(idClick))
            authClickHandler((authsDef.filter(function (el){return el.id === idClick}))[0])
            
/*        if(!authsExclude.includes(idClick)){
            var author = authors.filter(function (item){ return item.id === idClick})[0];
            authsExclude[authsExclude.length] = idClick
            $("#authList").append("<li  id=\"a"+idClick+"\"class=\"list-group-item pAuth\"><strong>"+authsExclude.length+".</strong> "+author.value+"</li>")
            //prettyPrintAuthor(suggestion)
            authorBars()
            authorGraph()
        }*/
    }
}   

function ListMouseOver(event){
    var idClick = event.target.id;
    
    if(!idClick)
        idClick = event.target.parentNode.id
    
    if(idClick[0]=='p'){
        if(!click){
            idClick = idClick.substring(1,idClick.length);
            d3.select(event.target).transition().duration(200)
            .style("background-color", "rgba( 71, 66, 66, 0.2)") 
            svgP.select("#p"+idClick).transition()
                .duration(200)
                .attr("r", 10)
                .attr("fill", function(d){
                    d3.selectAll(".authNode")
                        .transition().duration(200)
                        .attr("fill", function(d1){ 
                            if(d.authsId.includes(d1.id))
                                return color_n(d.color);
                            else 
                                return "rgba( 221, 167, 109, 0.342 )"
                         })        
                    return color_n(d.color)            
            })  
        }else return;
    }else{
        idClick = idClick.substring(1,idClick.length);
        d3.select("#ag"+idClick)
        .transition().duration(200)
        .attr("r", 7)
     d3.select("#aa"+idClick).transition().duration(200).attr('fill',"rgba( 138, 223, 223, 0.569 )")
        d3.select(event.target).transition().duration(200)
            .style("background-color", function(){ return "rgba( 138, 223, 223, 0.569 )";})   
         if(!click){
    reset_texts()
    //if(click) unclick_auth();
    d3.select("#aa"+idClick)
        .transition().duration(200)
        .attr('fill',"rgba( 138, 223, 223, 0.569 )")

    d3.select("#aaline"+idClick)
        .transition().duration(200)
        .style('stroke',"rgba( 138, 223, 223, 0.569 )")
    
    d3.select("#ag"+idClick)
        .transition().duration(200)
        .attr("r", 7)
    
    d3.selectAll(".plink")
        .style("opacity", 0.2)
    
    d3.selectAll(".papersNode")
        .style("opacity", function(d1){
            if(d1.authsId.includes(idClick))
                return 1;
            else
                return 0.2;
        })
        .attr("r", function(d1){
            if(d1.authsId.includes(idClick))
                return "9";
            else return "6";
        })
        .attr("stroke", function(d1){
            if(d1.authsId.includes(idClick))
                return "#d08701";
            else
                if(idPs.includes(d1.id))                    
                    return "#4238ff"
                    //return "#6d10ca";
                else
                    return "#999";
            })
        .attr("stroke-width", function(d1){
            if(d1.authsId.includes(idClick)){
                papName(d1)
                return 3.5;
            }
            else
                if(idPs.includes(d1.id))                    
                    return 2.5;
            })
    }
    else if(idClick != idClickedA && clkIds.includes(idClick)){
        reset_texts()
        d3.selectAll(".papersNode")
            .style("opacity", function(d1){
                var al = d1.authsId;
                return al.includes(idClick) && al.includes(idClickedA) ? 1 : 0;
            })
            .attr("r",  function(d1){
                var al = d1.authsId, found = al.includes(idClick) && al.includes(idClickedA);
                if (found) papNameConflict(d1);
                return found ? 9 : 6;
            })
        //mostra autori conflittati in AG e AB
        d3.selectAll(".paper_in_bars").style("opacity", function(d1){
            var al = d1.authsId;
            return al.includes(idClick) && al.includes(idClickedA) ? 1:0;
        })
        d3.selectAll(".aglink")
            .style("opacity", function(d1){ 
                if((d1.source.id === idClick || d1.target.id === idClick) 
                   && (d1.source.id === idClickedA || d1.target.id 
                    === idClickedA)) {
                        let value = authsDef.filter(function (el){ return el.id === idClickedA;})[0].value;
                        var txt = clkA.value + " - " + value
                        popTextA.text(txt)
                        var el   = document.getElementById("svgAG_names");
                        var rect = el.getBoundingClientRect(); // get the bounding rectangle

                        var bbox = popTextA.node().getBBox();
                        var wd = bbox.width,
                            ht = bbox.height;
                        //popRect.attr('fill', color(d.color))
                        popTextA.attr("x", function(){
                            let ret = rect.width - wd - 28;
                            //console.log("ret "+ret+ "wd "+wd+" ht "+ht)
                            return ret;})
                            .attr("y", 20)
                            .style("opacity", 1)
                        popTextA.append('svg:tspan')
                            .attr("class", "txtspan")
                          .attr('x', function(){
                            let ret = rect.width - wd - 28;
                            return ret;})
                          .attr('dy', 20)
                          .text(function() {
                            return d1.value + " shared papers"; })
                            .append('svg:tspan')
                            .attr("class", "txtspan")
                          .attr('x', function(){
                            let ret = rect.width - wd - 28;
                            return ret;})
                          .attr('dy', 20)
                          .text(function() {
                            var shared_in_viz = papersFiltered.filter(function (el){
                                    return el.authsId.includes(idClickedA) && el.authsId.includes(idClick);
                                })
                            return shared_in_viz.length+" visualized"; })
                        popRectA.attr("x", function(){return rect.width - wd - 33})
                            .attr('y',5)
                            .attr('width',function(){return wd + 10})
                            .attr('height',function(){return 3*ht + 17})
                            .style('opacity',1)
                        return  1 
                    } else return 0; })
        d3.selectAll(".authors-dot")
            .style("opacity", function(d1){ return d1.id === idClick || d1.id === idClickedA ?  1 : 0; })
        d3.selectAll(".authNode")
            .style("opacity", function(d1){ return d1.id === idClick || d1.id === idClickedA ? 1 : 0; })
        d3.selectAll(".authlLine")
            .style('opacity', function(d1){ return d1.id === idClick || d1.id === idClickedA ?  1:0; })
        d3.selectAll(".auth-name")
            .style("opacity", function(d1){ 
                if(d1.id === idClick || d1.id === idClickedA){
                    return 1;
                }else{
                        d3.selectAll(".p"+d1.id).style("opacity", 0)
                        return 0;
                }})  
        
    }

        
        
    }
}

function ListMouseOut(event){
    var idClick = event.target.id;
    
    if(!idClick)
        idClick = event.target.parentNode.id
    
    if(idClick[0]=='p'){
        if(!click){
            idClick = idClick.substring(1,idClick.length);
            d3.select(event.target).transition().duration(200)
                .style("background-color", "rgba( 71, 66, 66, 0)") 
            svgP.select("#p"+idClick).transition()
                .duration(200)
                .attr("r", 6)
                .attr("fill", function(d){
                    return color_n(d.color) 
                }) 
            d3.selectAll(".authlLine")
                .style('stroke',function (d){
                            if(!(authsExclude.includes(d.id) || authsReview.includes(d.id)) && (authColor(d) || authColor_r(d)))
                                return "rgba( 188, 188, 188, 0.454 )"
                            else
                                return "rgba( 221, 167, 109, 0.342 )"
                        })
                .style("opacity", 1)
                .style("pointer", "cursor")
            d3.selectAll(".authNode")
                .attr('fill', function (d){
                        if((authColor(d) || authColor_r(d)) && !(authsExclude.includes(d.id) || authsReview.includes(d.id) ))
                            return "rgba( 188, 188, 188, 0.454 )"
                        else
                            return "rgba( 221, 167, 109, 0.342 )"
                    })
                .style("opacity", 1)
                .style("pointer", "cursor")
            d3.selectAll(".auth-name")
                .style("opacity", 1)
        }else return;
    }else{
       idClick = idClick.substring(1,idClick.length);
                d3.select("#ag"+idClick)
        .transition().duration(200)
        .attr("r", a_radius) 

        d3.select(event.target).transition().duration(200)
            .style("background-color", "rgba( 71, 66, 66, 0)") 
           if(!click){     
    reset_texts()
    //if(click) unclick_auth();
    d3.select("#aa"+idClick).transition().duration(200).attr('fill', function (d){
                
                if((authColor(d) || authColor_r(d)) && !(authsExclude.includes(idClick) || authsReview.includes(idClick) ))
                    return "rgba( 188, 188, 188, 0.454 )"
                else
                    return "rgba( 221, 167, 109, 0.342 )"
            })
    
   d3.select("#ag"+idClick)
        .transition().duration(200)
        .attr("r", a_radius) 
    d3.select("#aaline"+idClick).transition().duration(200).style('stroke',function (d){
                    if(!(authsExclude.includes(idClick) || authsReview.includes(idClick)) && (authColor(d) || authColor_r(d)))
                        return "rgba( 188, 188, 188, 0.454 )"
                    else
                        return "rgba( 221, 167, 109, 0.342 )"
                })

    d3.selectAll(".plink")
        .transition().duration(200)
        .style("opacity", 1)
    d3.selectAll(".papersNode")
        .transition().duration(200)
        .attr("r", "6")
        .style("opacity", 1)
        .attr("stroke", function(d1){
            if(d1.authsId.includes(idClick))
                d3.select($("#txt"+d1.id)[0])
                    .attr("x", -1000)
                    .attr("y", -1000)
                    .attr("opacity", 0)  
            if(idPs.includes(d1.id))
                return "#4238ff"
                //return "#6d10ca";
            else return "#999";
            })
        .attr("stroke-width", function(d1){
            if(idPs.includes(d1.id))
                return 2.5;
            })
   }else if(idClick != idClickedA) {
        popTextA.style("opacity", 0)
        popRectA.style('opacity',0)
        d3.select(".txtspan").remove()
        reclick_auth(authsDef.filter(function (el){ return el.id === idClickedA;})[0])
    }
        
        
    }
}

function papDblc(event){
    var idClick = event.target.id,
        idClick = idClick.substring(1,idClick.length),
        paper = papersFiltered.filter(function (item){ return item.id === event.target.id.substring(1, event.target.id.length)})[0];
    d3.select(this).style("background-color", "red").transition()
        .duration(500)
        .style("opacity", "0")
    d3.selectAll(".paplist").transition()
        .duration(500)
        .style("opacity", "0")
    $('#papList').html("")
    deleteP(idClick)
    document.getElementsByClassName("td2title").innerHTML = ""
}

function authDblc(event){
    var idClick = event.target.id,
        idClick = idClick.substring(1,idClick.length),
        index = authsExclude.indexOf(idClick),
        lp = authsExclude.length-1;
    $('#authList').html("")
    authsExclude.splice(index, 1);
    //console.log(authsExclude)
    if(authsExclude.length > 0){
        var new_auths = authors.filter(function (item){
                return authsExclude.includes(item.id)}),
            al = new_auths.length;
        authsExclude = []
        for(var i = 0; i < al; i++){
            let suggestion = new_auths[i],
                aName = suggestion.value;
            idA = suggestion.id
                authsExclude[authsExclude.length] = idA
                $("#authList").append("<li id=\"a"+idA+"\" class=\"list-group-item  pAuth pAuthe\"><strong>"+(i+1)+".</strong> "+suggestion.value+"</li>")      
        } 
    }
    
    d3.selectAll(".plink")
        .transition().duration(200)
        .style("opacity", 1)
    d3.selectAll(".papersNode")
        .transition().duration(200)
        .attr("r", "6")
        .style("opacity", 1)
        .attr("stroke", function(d1){
            if(d1.authsId.includes(idClick))
                d3.select($("#txt"+d1.id)[0])
                    .attr("x", -1000)
                    .attr("y", -1000)
                    .attr("opacity", 0)  
            if(idPs.includes(d1.id))
                return "#4238ff"
                //return "#6d10ca";
            else return "#999";
            })
        .attr("stroke-width", function(d1){
            if(idPs.includes(d1.id))
                return 2.5;
            })
    reset_texts()
    authorBars()
    authorGraph()
}

function r_authDblc(event){
    var idClick = event.target.id,
        idClick = idClick.substring(1,idClick.length),
        index = authsReview.indexOf(idClick),
        elementPos = authsReview_obj.map(function(x) {return x.id; }).indexOf(idClick);
    
    $('#rauthList').html("")

    authsReview.splice(index, 1);
    authsReview_obj.splice(elementPos, 1);
    //console.log(authsReview_obj)
    if(authsReview.length > 0){
        var al = authsReview_obj.length;
        for(var i = 0; i < al; i++){
            let suggestion = authsReview_obj[i];
            $("#rauthList").append("<li id=\"a"+idA_rev+"\" class=\"list-group-item pAuth pAuthr\"><strong>"+authsReview.length+".</strong> "+suggestion.value+" <a target=\"_blank\" class=\"dblp links\" href=\"https://dblp.uni-trier.de/search?q="+suggestion.value.split(' ').join('+')+"\">dblp</a></li>")  
        } 
   }
        d3.selectAll(".plink")
        .transition().duration(200)
        .style("opacity", 1)
    d3.selectAll(".papersNode")
        .transition().duration(200)
        .attr("r", "6")
        .style("opacity", 1)
        .attr("stroke", function(d1){
            if(d1.authsId.includes(idClick))
                d3.select($("#txt"+d1.id)[0])
                    .attr("x", -1000)
                    .attr("y", -1000)
                    .attr("opacity", 0)  
            if(idPs.includes(d1.id))
                return "#4238ff"
                //return "#6d10ca";
            else return "#999";
            })
        .attr("stroke-width", function(d1){
            if(idPs.includes(d1.id))
                return 2.5;
            })
    reset_texts()
    authorBars()
    authorGraph()
    
//    d3.select("#aa"+idClick).attr('fill',function (d){
//                    if(authColor(d))
//                        return "rgba( 188, 188, 188, 0.454 )"
//                    else
//                        return "rgba( 221, 167, 109, 0.342 )"
//                })
//    
//   d3.select("#ag"+idClick)
//        .transition().duration(200)
//        .attr("r", function(d){
//            if(idAs.includes(d.id))
//                return 4.5;
//            else return 2.5;
//            }) 
//    d3.select("#aaline"+idClick).transition().duration(200).style('stroke',function (d){
//                    if(authColor(d))
//                        return "rgba( 188, 188, 188, 0.454 )"
//                    else
//                        return "rgba( 221, 167, 109, 0.342 )"
//                })
//    d3.selectAll(".plink")
//        .transition().duration(200)
//        .style("opacity", 1)
//    d3.selectAll(".papersNode")
//        .transition().duration(200)
//        .attr("r", "6")
//        .style("opacity", 1)
//        .attr("stroke", function(d1){
//            if(d1.authsId.includes(idClick))
//                d3.select($("#txt"+d1.id)[0])
//                    .attr("x", -1000)
//                    .attr("y", -1000)
//                    .attr("opacity", 0)  
//            if(idPs.includes(d1.id))
//                return "#6d10ca";
//            else return "#999";
//            })
//        .attr("stroke-width", function(d1){
//            if(idPs.includes(d1.id))
//                return 2.5;
//            })
    
}
