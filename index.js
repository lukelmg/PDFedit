var hummus = require('hummus');
var _ = require('lodash');
var extractText = require('./lib/text-extraction');

function runMe() {
    var fileToRun = './samples/HighLevelContentContext.pdf';
    var pdfReader = hummus.createReader(fileToRun);

    var pagesPlacements = extractText(pdfReader);
    
    //console.log('pages text placements',JSON.stringify(pagesPlacements,null,2));

    var pdfWriter = hummus.createWriterToModify(fileToRun,{modifiedFilePath:'./samples/test_out.pdf'});
    for(var i=0;i<pagesPlacements.length;++i) {
        var pageModifier = new hummus.PDFPageModifier(pdfWriter,i);
		var cxt = pageModifier.startContext().getContext();
        pagesPlacements[i].forEach((placement)=> {
            if (placement.text == 'Circles') {
                cxt.q();
                cxt.cm.apply(cxt,placement.matrix);
                cxt.drawRectangle(placement.localBBox[0],placement.localBBox[1],placement.localBBox[2]-placement.localBBox[0],placement.localBBox[3]-placement.localBBox[1],{color:'Red',width:2});
                cxt.Q();
            }
        });
		pageModifier.endContext().writePage();
    }
    pdfWriter.end();
}

runMe();