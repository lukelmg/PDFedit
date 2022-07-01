var hummus = require('hummus');
var _ = require('lodash');
var extractText = require('./lib/text-extraction');

var run  = 0;
var e = 0;
var t = 0;

function runMe() {
    var fileToRun = './samples/pogbatch.pdf';
    var pdfReader = hummus.createReader(fileToRun);

    var pagesPlacements = extractText(pdfReader);

    var pdfWriter = hummus.createWriterToModify(fileToRun,{modifiedFilePath:'./samples/test_out.pdf'});
    for(var i=0;i<pagesPlacements.length;++i) {
        var pageModifier = new hummus.PDFPageModifier(pdfWriter,i);
		var cxt = pageModifier.startContext().getContext();
        pagesPlacements[i].forEach((placement)=> {
            if (placement.text == 'i' && pagesPlacements[i][e+1].text == 'n' && pagesPlacements[i][e+2].text == 'k') {
                cxt.q();
                cxt.drawRectangle(placement.matrix[4]-2, 782-placement.matrix[5], 30, 12,{color:'Red',width:2})
                cxt.Q();
                run++;
            }
            if (pagesPlacements[i][e].text == 't' && pagesPlacements[i][e+1].text == 'o' && pagesPlacements[i][e+2].text == 'n' && pagesPlacements[i][e+3].text == 'e' && pagesPlacements[i][e+4].text == 'r') {
                cxt.q();
                cxt.drawRectangle(placement.matrix[4]-2, 782-placement.matrix[5], 30, 12,{color:'Green',width:2})
                cxt.Q();
                run++;
            }
            e++;
        });
        e = 0;
		pageModifier.endContext().writePage();
    }
    pdfWriter.end();
}


runMe();