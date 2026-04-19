def ScrapeForGrindSpots():
    import undetected_chromedriver as uc
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    import time
    
    urls = [
        'https://garmoth.com/grind-tracker/global'
    ]
    counter = 0
    options = uc.ChromeOptions()
    options.add_argument('--headless=new')  
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    options.add_argument("--disable-software-rasterizer")
    options.add_argument("--remote-debugging-port=9222")
    options.add_argument('--disable-images')  # skip loading images
    options.add_argument('--blink-settings=imagesEnabled=false')
    options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36')
    driver = uc.Chrome(version_main=147, options=options)
    wait = WebDriverWait(driver, 30)
    item_list = []
    seen = set()
    for url in urls:
        print(f"Starting url: {url}")
        driver.get(url)
        if counter == 0:
            # switch to NA regionx
            wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "div.rounded-md"))).click()
            time.sleep(1)

            # then click NA
            wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='NA']/parent::div"))).click()

            # wait for table data
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "tbody tr")))
        time.sleep(2)  # small buffer for all rows to populate
        counter += 1
        rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")
        for row in rows:
            cells = [c.text for c in row.find_elements(By.CSS_SELECTOR, "td")]
            cells = [c for c in cells if c and c != "Unknown Name"]
            
            if cells:
                #     SPOT              TRASH/HR                        HOURS                               SILVER/HR
                # print(cells[0], int(cells[-3].replace(",", "")), int(cells[-2].replace(",", "")), int(cells[-1].replace(",", "")))
                trash = int(cells[-3].replace(",", ""))
                hours = int(cells[-2].replace(",", ""))
                silver = int(cells[-1].replace(",", ""))

           
                
                item_list.append((cells[0], hours, silver, trash))
                
                
    driver.quit()
    return item_list
# ScrapeForGrindSpots()