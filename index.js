const {Builder, By, Key, util, WebElement} = require("selenium-webdriver")
const { elementIsNotSelected } = require("selenium-webdriver/lib/until");


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////           Generic Methods           ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

// Used to wait some time in seconds
async function wait(timeInSeconds){
    await new Promise(resolve => setTimeout(resolve, 1000*timeInSeconds));
}    

////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////           Page Methods           /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//Get a new driver
async function getDriver(){
    return await new Builder().forBrowser("firefox").build();
}

//Maximize current window
async function maximizeWindow(driver){ //Maximize window
    await driver.manage().window().maximize();
}

//Go to 'pagePath' webpage
async function goToPage(driver,pagePath){
    await driver.get(pagePath);
}

//Open new window and goes to that window, if 'returnCurWindow=true' it returns current window
async function openWindow(driver,newWindowUrl,waitTime,returnCurWindow=false){
    await driver.executeScript('window.open("' + newWindowUrl + '");');
    
    let windows = await driver.getAllWindowHandles();
    await driver.switchTo().window(windows[windows.length - 1]);

    await wait(waitTime);
    if (returnCurWindow){
        return windows[windows.length - 2]
    }
}

//Close current window and go to passed window, or previous one, if no window is passed
async function closeWindow(driver,waitTime,nextWindow=null){ 
    await driver.close();
    let windows = await driver.getAllWindowHandles();
    let toGoWindow = (nextWindow === null ? windows[windows.length - 1] : nextWindow);
    await driver.switchTo().window(toGoWindow);
    await wait(waitTime);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////           Basic Methods           ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//Used to type
async function typeSlowly(driver,string,xpathStr,waitTimeKey,waitTimeEnd){
    for(const key of string){
        await driver.findElement(By.xpath(xpathStr)).sendKeys(key);
        await wait(waitTimeKey);
    }    
    await wait(waitTimeEnd);
}     

//Used to click
async function clickXPath(driver,vars,waitTime=0){
    let xPathStr = vars[0];
    await driver.findElement(By.xpath(xPathStr)).click();
    await wait(waitTime);
    return true;
}    

//Used to get element
async function getElement(driver,vars,waitTime=0){
    let xPathStr = vars[0];
    let element = await driver.findElement(By.xpath(xPathStr));
    await wait(waitTime);
    return element
}    

//Used to get elements array
async function getElements(driver,vars,waitTime=0){
    let xPathStr = vars[0];
    let elements = await driver.findElements(By.xpath(xPathStr));
    await wait(waitTime);
    return elements
}        

//Used to get element attribute
async function getElemAttrByXPath(driver,vars,waitTime=0){
    let xPathStr = vars[0], attributeType = vars[1];
    var element = await getElement(driver,xPathStr);
    var attribute = await element.getAttribute(attributeType);
    await wait(waitTime);
    return attribute;
}

//Used to get given attribute of many elements
async function getElemsAttrByXPath(driver,vars,waitTime=0){
    let xPathStr = vars[0], attributeType = vars[1];
    var elemAttrs = await driver.findElements(By.xpath(xPathStr))

    for(i = 0;i<elemAttrs.length;i++) elemAttrs[i] = await elemAttrs[i].getAttribute(attributeType);

    await wait(waitTime);
    return elemAttrs;
}



///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////           General Methods           ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//To make action or return error, otherwise
async function xPathTryCatch(driver,funct,vars,errorMessage,waitTime=0){
    let returnVal = false;
    try{
        returnVal = await funct(driver,vars);
    }
    catch(error){
        returnVal = false;
        console.log(errorMessage);
    }
    await wait(waitTime);
    return returnVal;
}

//To try getting element until satisfied or maxRepts is reach 
async function xPathWhileTrue(driver,funct,vars,waitTime=0,waitBetween=0.5,maxRepts=1000){
    var continueWhile = true;
    var returnVal = false;
    let iter = 0;
    while(continueWhile === true){
        continueWhile = false;
        try{
            returnVal = await funct(driver,vars);
        }    
        catch{
            returnVal = false;
            continueWhile =  iter === maxRepts ? false : true;
            await wait(waitBetween);
        }
        iter++;    
    }    
    await wait(waitTime);
    return returnVal;
}