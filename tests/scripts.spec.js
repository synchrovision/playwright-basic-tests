import fs from 'fs';
import {test,expect} from '@playwright/test';

const getUrlSetNames=()=>{
	const names=[];
	fs.readdirSync('urlset').forEach(fname=>names.push(fname.slice(0,-4)));
	return names;
}
const serUrls=(name,urls)=>{
	if(name==null){name='default';}
	const text=urls.join("\n");
	fs.writeFileSync(`urlset/${name}.txt`,text,{encoding:'utf8'});
}
const getUrls=(name)=>{
	if(name==null){name='default';}
	const text=fs.readFileSync(`urlset/${name}.txt`,'utf8');
	return text.split("\n").filter((url)=>url!=null && url.slice(0,1)!="#");
}
const scrollToLazyAllImages=async(page)=>{
	const lazyImages=await page.locator('img[loading="lazy"]:visible').all();
	for(const lazyImage of lazyImages){
		await lazyImage.scrollIntoViewIfNeeded();
	}
};
const curryClawl=(name)=>async({page,browserName},testInfo)=>{
	const baseUrls=getUrls(name);
	const done={};
	const urlFlags={};
	for(let baseUrl of baseUrls){
		if(done[baseUrl]){continue;}
		testInfo.setTimeout(testInfo.timeout + 10000);
		urlFlags[baseUrl]=true;
		const baseUrlObj=new URL(baseUrl);
		await page.goto(baseUrl);
		const links=await page.locator('a[href]').all();
		for(const link of links){
			const linkUrlObj=new URL(await link.getAttribute('href'),baseUrl);
			linkUrlObj.hash='';
			linkUrlObj.search='';
			const linkUrl=linkUrlObj.toString();
			if(linkUrlObj.hostname!==baseUrlObj.hostname || urlFlags[linkUrl]){continue;}
			if(!baseUrls.includes(linkUrl)){baseUrls.push(linkUrl);}
			urlFlags[linkUrl]=true;
		}
		done[baseUrl]=true;
	}
	serUrls(name,Object.keys(urlFlags));
};
const curryScreenshot=(name)=>async({page,browser},testInfo)=>{
	const urls=getUrls(name);
	for(let url of urls){
		testInfo.setTimeout(testInfo.timeout + 20000);
		const urlObj=new URL(url);
		await page.goto(url);
		await scrollToLazyAllImages(page);
		let pathname=urlObj.pathname;
		if(pathname.endsWith('/')){pathname+='index.html';}
		await page.screenshot({path:`screenshot/${name}/${testInfo.project.name}${pathname}.png`,fullPage:true});
	}
};
const curryCheckBrokenLinks=(name)=>async({page,browser},testInfo)=>{
	const urls=getUrls(name);
	const done={};
	const brokenLinks={};
	for(let url of urls){
		const baseUrl=url;
		await page.goto(url);
		const linkUrlFlag={};
		for(const link of await page.locator('[href]').all()){
			const url=await link.getAttribute('href')
			linkUrlFlag[url]=true;
		}
		for(const link of await page.locator('[src]').all()){
			const url=await link.getAttribute('src');
			linkUrlFlag[url]=true;
		}
		const linkUrls=Object.keys(linkUrlFlag);
		for(const maybeRelLinkUrl of linkUrls){
			const linkUrlObj=new URL(maybeRelLinkUrl,baseUrl);
			if(linkUrlObj.protocol!=='http:' && linkUrlObj.protocol!=='https:'){continue;}
			const linkUrl=linkUrlObj.toString();
			if(done.hasOwnProperty(linkUrl)){
				if(brokenLinks[linkUrl]!=null){
					brokenLinks[linkUrl].push(baseUrl);
				}
				continue;
			}
			testInfo.setTimeout(testInfo.timeout + 3000);
			const response=await fetch(linkUrl,{method:'HEAD'});
			if(!response.ok){
				brokenLinks[linkUrl]=[baseUrl];
				console.error(response.status+' : '+linkUrl+' in '+baseUrl);
			}
			expect.soft(response.ok,response.status+' : '+linkUrl+"\n "+baseUrl).toBeTruthy();
			done[linkUrl]=true;
		}
	}
	const numBrokenLinks=Object.keys(brokenLinks).length;
	expect(numBrokenLinks,numBrokenLinks+' broken link was found').toBe(0);
}


test.describe('clawl',()=>{
	const names=getUrlSetNames();
	for(const name of names){test(name,curryClawl(name));}
});
test.describe('screenshot',()=>{
	const names=getUrlSetNames();
	for(const name of names){test(name,curryScreenshot(name));}
});
test.describe('checkBrokenLinks',()=>{
	const names=getUrlSetNames();
	for(const name of names){test(name,curryCheckBrokenLinks(name));}
});