def ScrapeForItems():
    import undetected_chromedriver as uc
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    import time

    urls = [
        'https://garmoth.com/market/category/enhancement-upgrade/black-stone',
        "https://garmoth.com/market/category/enhancement-upgrade/reforge",
        "https://garmoth.com/market/category/accessories/ring",
        "https://garmoth.com/market/category/accessories/necklace",
        "https://garmoth.com/market/category/accessories/earring",
        "https://garmoth.com/market/category/accessories/belt",
        "https://garmoth.com/market/category/material/ore-and-gem",
        "https://garmoth.com/market/category/material/plants",
        "https://garmoth.com/market/category/material/seed-and-fruit",
        "https://garmoth.com/market/category/material/leather",
        "https://garmoth.com/market/category/material/blood",
        "https://garmoth.com/market/category/material/meat",
        "https://garmoth.com/market/category/mount/courser-training",
        "https://garmoth.com/market/item/715001",
        "https://garmoth.com/market/item/719897",
        "https://garmoth.com/market/item/719898",
        "https://garmoth.com/market/item/719899",
        "https://garmoth.com/market/item/719900",
        "https://garmoth.com/market/item/731101",
        "https://garmoth.com/market/item/735001",
        "https://garmoth.com/market/category/enhancement-upgrade/upgrade"
    ]
    counter = 0
    options = uc.ChromeOptions()
    options.add_argument('--headless=new')  
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--disable-images')  # skip loading images
    options.add_argument('--blink-settings=imagesEnabled=false')
    options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36')
    driver = uc.Chrome(version_main=145, options=options)
    wait = WebDriverWait(driver, 30)
    item_list = []
    for url in urls:
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
            
            change = cells[2]
            direction = change[0]
            value = change[1:-1].replace(",", "")
            if cells and cells[0] != '0' and value != '':
                cells[3] = cells[3].replace(",", "")
                cells[1] = cells[1].replace(",", "")
                if direction == '-':
                    value = -int(value)
                item_list.append((cells[0], int(value), int(cells[1]),  int(cells[3])))
    driver.quit()
    return item_list
# ScrapeForItems()