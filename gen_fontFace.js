const fs        = require('fs');
const fontScss  = 'app/scss/_fonts.scss',
      fontFiles = 'dist/font/';

//fs.readFile___ read inner content of file
//'utf8'___ transform content
const content = fs.readFile(fontScss, 'utf8', (err, data)=> {
  if(err) console.log(err);

// data___content of file
  if(data) {
    console.log("file is not empty");
    //fs.unlink___ delete file
    fs.unlink(fontScss, (err)=> {
      if(err) console.log(err);

      console.log(`file: ${fontScss} has been successfully deleted`)
      include();
    });
  } else {
    include();
  }
});

function include() {
  
  //fs.readdir__ read all files in directory
  fs.readdir(fontFiles, (err, files) => {
    
    //files__array files
    files.forEach((file, index)=> {
      let fileName      = file.split('.')[0],
          fileExt       = file.split('.')[1],
          fileNameLow   = fileName.toLowerCase(),
          weight, style;
      if(fileExt === 'woff2') return;

      fileNameLow.includes('italic') ? style = 'italic' : style = 'normal';
      if(fileNameLow.includes('thin') || fileNameLow.includes('100')) {
        weight = 100;
      } else if(fileNameLow.includes('extralight') || fileNameLow.includes('200')) {
        weight = 200;
      } else if(fileNameLow.includes('light') || fileNameLow.includes('demi') || fileNameLow.includes('300')) {
        weight = 300;
      } else if(fileNameLow.includes('regular') || fileNameLow.includes('normal') || fileNameLow.includes('400')) {
        weight = 400;
      } else if(fileNameLow.includes('medium') || fileNameLow.includes('500')) {
        weight = 500;
      } else if(fileNameLow.includes('semibold') || fileNameLow.includes('demibold') || fileNameLow.includes('600')) {
        weight = 600;
      } else if(fileNameLow.includes('bold') || fileNameLow.includes('700')) {
        weight = 700;
      } else if(fileNameLow.includes('extrabold') || fileNameLow.includes('heavy') || fileNameLow.includes('800')) {
        weight = 800;
      } else if(fileNameLow.includes('black') || fileNameLow.includes('900')) {
        weight = 900;
      } else {
        weight = 400;
      }

      fs.appendFile(
        'app/scss/_fonts.scss',
        `@include font-face(${fileName}, ${fileName}, ${weight}, ${style});\n`,
        ()=> {}
      )
    })
  })
}