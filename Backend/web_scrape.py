# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.webdriver.chrome.options import Options



# options = Options()
# # options.add_argument("--headless")
# options.add_argument("--incognito")
# options.add_argument("--disable-blink-features=AutomationControlled")
# options.add_experimental_option("excludeSwitches", ["enable-automation"])
# options.add_experimental_option("useAutomationExtension", False)
# driver = webdriver.Chrome(options=options)
# driver.execute_cdp_cmd("Network.setBlockedURLs", {"urls": ["*nitro*", "*ads*", "*hadron*", "*audigent*"]})
# driver.execute_cdp_cmd("Network.enable", {})

# wait = WebDriverWait(driver, 60)
# driver.get("https://garmoth.com/market/category/accessories/ring")
# driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
#     "source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
# })
# import time
# time.sleep(10)  # hard wait, no shortcuts
# with open("page_source.html", "w", encoding="utf-8") as f:
#     f.write(driver.page_source)
# print("saved!")

# print(driver.page_source[:3000].encode('utf-8', errors='replace').decode('utf-8'))
# # for url in urls:
# #     driver.get(url)
# #     wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "tbody tr td")))
# #     # # Click the region switcher div
# #     # region_btn = driver.find_element(By.XPATH, "//p[text()='EU']/parent::div")
# #     # region_btn.click()

# #     # # Wait for NA option and click it
# #     # na_option = wait.until(EC.element_to_be_clickable((By.XPATH, "//p[text()='NA']")))
# #     # na_option.click()
# #     for row in driver.find_elements(By.CSS_SELECTOR, "tbody tr"):
# #         cells = [c.text for c in row.find_elements(By.CSS_SELECTOR, "td") if c.text and c.text != "Unknown Name"]
# #         if not cells:
# #             continue

# #         # Column 5 (index 4) = weekly % change
# #         if len(cells) >= 5:
# #             change = cells[4]
# #             direction = change[0]       # + or -
# #             value = change[1:-1]        # strip sign and % symbol
# #             cells[4] = f"{value} {direction}"

# #         print(" ".join(cells))

# driver.quit()

# # from playwright.sync_api import sync_playwright
# # import time

# # urls = [
# #     "https://garmoth.com/market/category/enhancement-upgrade/black-stone",
# #     # add more urls...
# # ]

# # with sync_playwright() as p:
# #     browser = p.chromium.launch(
# #         channel="msedge", 
# #         headless=False
# #     )
# #     # context = browser.new_context(
# #     #     user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
# #     #     viewport={"width": 1280, "height": 720},
# #     # )
# #     page = browser.new_page()

# #     for url in urls:
# #         page.goto(url)
# #         page.wait_for_selector("tbody tr td", timeout=30000)
# #         with open("page_source.html", "w", encoding="utf-8") as f:
# #             f.write(page.content())
# #         # # switch region to NA
# #         # page.click("//p[text()='EU']")  # open dropdown
# #         # page.click("//p[text()='NA']")  # select NA
# #         # time.sleep(5)  # wait for table reload

# #         # grab rows
# #         rows = page.query_selector_all("tbody tr")
# #         print(f"{url}: found {len(rows)} rows")

# #         for row in rows:
# #             cells = [c.inner_text() for c in row.query_selector_all("td")]
# #             cells = [c for c in cells if c and c != "Unknown Name"]
# #             if len(cells) >= 5:
# #                 change = cells[4]
# #                 direction = change[0]
# #                 value = change[1:-1]
# #                 cells[4] = f"{value} {direction}"
# #             if cells:
# #                 print(" ".join(cells))

# #     browser.close()
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
        "https://garmoth.com/market/category/mount/courser-training"
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