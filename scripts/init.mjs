import fs from 'fs';

(()=>{
	if(!fs.existsSync('urlset')){
		fs.mkdirSync('urlset');
	}
	if(!fs.existsSync('urlset/default.txt')){
		fs.writeFileSync('urlset/default.txt','https://example.com/',{encoding:'utf8'});
	}
})();