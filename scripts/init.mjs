import fs from 'fs';

(()=>{
	if(!fs.existsSync('urls.txt')){
		fs.writeFileSync('urls.txt','https://example.com/',{encoding:'utf8'});
	}
})();