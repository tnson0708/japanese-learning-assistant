#!/usr/bin/env python3
"""
Assign a 'category' to every word in jlpt-words.json using regex word-boundaries (\b)
on Vietnamese meaning + romaji/kana patterns.
"""

import json, re
from pathlib import Path

ROOT = Path(__file__).parent.parent
DATA = ROOT / "src" / "data" / "jlpt-words.json"

# Rules list in order of evaluation. First matching category wins.
RULES = [
    # 1. Time & Calendar
    ("time_calendar", [
        (r"\b(giờ|phút|giây|buổi sáng|buổi trưa|buổi chiều|buổi tối|ban đêm|sáng sớm|nửa đêm)\b", "v"),
        (r"\b(hôm nay|ngày mai|hôm qua|ngày kia|hôm kia)\b", "v"),
        (r"\b(tuần này|tháng này|năm nay|tuần tới|tháng tới|năm tới|tuần trước|tháng trước|năm ngoái)\b", "v"),
        (r"\b(mùa xuân|mùa hè|mùa thu|mùa đông)\b", "v"),
        (r"\b(thứ hai|thứ ba|thứ tư|thứ năm|thứ sáu|thứ bảy|chủ nhật)\b", "v"),
        (r"\b(tháng một|tháng hai|tháng ba|tháng tư|tháng năm|tháng sáu|tháng bảy|tháng tám|tháng chín|tháng mười|tháng 11|tháng 12|năm mới|tết)\b", "v"),
        (r"\b(khoảng thời gian|thời gian|bây giờ|lúc này|hiện tại|quá khứ|tương lai|lịch)\b", "v"),
        (r"\b(mùng một|mùng hai|mùng ba|mùng bốn|mùng năm|mùng sáu|mùng bảy|mùng tám|mùng chín|mùng mười)\b", "v"),
        (r"\b(ngày mùng|mấy ngày)\b", "v"),
        (r"\b(gatsu|youbi|jikan|fun|pun|asa|hiru|yoru|kyou|ashita|kinou|konshu|kongetsu|kotoshi|raishu|raigetsu|rainen|senshu|sengetsu|sakunen|haru|natsu|aki|fuyu|gozen|gogo)\b", "r"),
        (r"^(ふつか|みっか|よっか|いつか|むいか|<ctrl42>のか|ようか|ここのか|とおか|はつか|ついたち)$", "w"),
    ]),

    # 2. Numbers & Counting
    ("numbers_counting", [
        (r"\b(một|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười|trăm|nghìn|vạn|triệu|tỷ)\b", "v"),
        (r"\b(hai mươi|ba mươi|bốn mươi|năm mươi|sáu mươi|bảy mươi|tám mươi|chín mươi)\b", "v"),
        (r"\b(số|con số|số lượng|đếm|bao nhiêu|mấy|mấy lần|mấy độ|số không)\b", "v"),
        (r"\b(ichi|ni|san|yon|roku|nana|hachi|kyuu|juu|nijuu|hyaku|sen|man|futatsu|mittsu|yottsu|itsutsu|muttsu|nanatsu|yattsu|kokonotsu|too|suuryou|kazu|zero|rei)\b", "r"),
        (r"^(いち|に|さん|よん|ご|ろく|なな|しち|はち|きゅう|く|じゅう|ひとつ|ふたつ|みっつ|よっつ|いつつ|むっつ|ななつ|やつ|ここのつ|とお)$", "w"),
    ]),

    # 3. Family & People
    ("family_people", [
        (r"\b(bố|mẹ|cha|con trai|con gái|anh trai|chị gái|em trai|em gái|ông|bà|chú|bác|dì|cô|cậu|dượng|thím)\b", "v"),
        (r"\b(gia đình|bạn bè|kết hôn|vợ|chồng|bé trai|bé gái|trẻ em|người nhật|người nước ngoài|cô ấy|anh ấy|bạn gái|bạn trai|hàng xóm|khách|thanh niên|nữ giới|nam giới|ông bà|cha mẹ|quý ông|quý bà|nhân loại)\b", "v"),
        (r"\b(giáo viên|thầy giáo|cô giáo|thầy/cô|học sinh|sinh viên|người)\b", "v"),
        (r"\b(kazoku|tomodachi|kodomo|josei|dansei|musuko|musume|sofu|sobo|oji|oba|nihonjin|gaikokujin|watashi|boku|anata|kimi|kare|kanojo|otokonoko|onnanoko|otousan|okaasan|oniisan|oneesan|otouto|imouto|sensei|gakusei|seito|hito)\b", "r"),
    ]),

    # 4. Body & Health
    ("body_health", [
        (r"\b(mắt|tai|mũi|miệng|ngón tay|ngón chân|đầu|cổ|vai|ngực|bụng|lưng|cánh tay|chân|răng|tóc|tim|gan|phổi)\b", "v"),
        (r"\b(bệnh viện|bác sĩ|y tá|thuốc|sức khỏe|cơ thể|thân thể|cảm cúm|cảm lạnh|sốt|đau|bị thương|chữa bệnh|phẫu thuật|khỏe mạnh|bệnh tật|triệu chứng)\b", "v"),
        (r"\b(karada|byouki|kenko|byouin|isha|kusuri|atama|nodo|mune|hara|me|mimi|hana|kuchi|ude|koshi|senaka|ashi|ha)\b", "r"),
    ]),

    # 5. Food & Drink
    ("food_drink", [
        (r"\b(bữa ăn|bữa sáng|bữa trưa|bữa tối|đồ ăn|đồ uống|thực phẩm|nước|nước uống|nước lọc)\b", "v"),
        (r"\b(cơm|bánh mì|thịt|cá|rau|hoa quả|trái cây|trứng|pizza|salad|súp|cà phê|sữa|bia|rượu|nước trái cây|kem|muối|đường|nước tương|cà chua|cà rốt|hành tây|khoai tây|chuối|táo|dâu tây|sushi|ramen|udon|soba|đậu phụ|cơm nắm|cơm hộp|thực đơn|mứt|bánh quy|kẹo)\b", "v"),
        (r"\b(ngon|cay|ngọt|đắng|mặn)\b", "v"),
        (r"\b(taberu|nomu|shokuji|gohan|pan|sushi|soba|ramen|udon|tofu|kohii|miruku|gyuunyuu|juusu|biiru|sake|wain|yasai|kudamono|tamago|shio|satou|shouyu|ringo|ichigo|banana|mizu)\b", "r"),
        (r"^(みず)$", "w"),
    ]),

    # 6. Home & Daily Life
    ("home_daily_life", [
        (r"\b(nhà ở|căn nhà|phòng|cửa ra vào|cửa sổ|vườn|bếp|phòng tắm|nhà vệ sinh|lối vào|sàn nhà|tường)\b", "v"),
        (r"\b(dọn dẹp|giặt đồ|nấu ăn|ngủ|thức dậy|sinh sống|cuộc sống)\b", "v"),
        (r"\b(đồ đạc|bàn|ghế|sofa|giường|tủ lạnh|bát đĩa|cốc|ly|chăn|gối|khăn|đèn điện|điều hòa|rác)\b", "v"),
        (r"\b(ie|uchi|heya|daidokoro|furo|toire|genkan|niwa|souji|sentaku|ryouri|neru|okiru|sumu|beddo|reizouko|sofaa|futon|kagu|sara|chawan|koppu)\b", "r"),
    ]),

    # 7. Clothing & Appearance
    ("clothing_appearance", [
        (r"\b(quần áo|áo sơ mi|cà vạt|tất|giày|dép|mũ|kính mắt|túi xách|ví|kimono|áo khoác|đồng phục|trang phục|vẻ ngoài|khuôn mặt|trang điểm|ô|dù|bộ vest|vali)\b", "v"),
        (r"\b(fuku|shatsu|kutsu|boushi|megane|kaban|saifu|kimono|yukata|kooto|kasa|suutsu|suutsukeesu|nekutai|kutsushita)\b", "r"),
    ]),

    # 8. Nature & Weather
    ("nature_weather", [
        (r"\b(thời tiết|mưa|nắng|mây|tuyết|gió|sấm chớp|bão|động đất|biển|núi|sông|rừng|bầu trời|sao|mặt trăng|mặt trời|thiên nhiên|hoa anh đào)\b", "v"),
        (r"\b(tenki|ame|hare|kumo|yuki|kaze|kaminari|taifuu|jishin|umi|yama|kawa|mori|sora|hoshi|taiyou|shizen|sakura)\b", "r"),
    ]),

    # 9. Animals & Plants
    ("animals_plants", [
        (r"\b(chó|mèo|chim|ngựa|bò|lợn|heo|khỉ|thỏ|rùa|rắn|ếch|gấu|hổ|động vật|thực vật|hoa|cây|cỏ|lá|côn trùng|bướm|muỗi)\b", "v"),
        (r"\b(inu|neko|tori|uma|ushi|buta|saru|usagi|kame|hebi|kaeru|tora|kuma|doubutsu|shokubutsu)\b", "r"),
    ]),

    # 10. Transportation & Travel
    ("transportation_travel", [
        (r"\b(tàu điện|xe buýt|taxi|máy bay|tàu thủy|ô tô|xe đạp|tàu cao tốc|tàu điện ngầm|xe máy|thang máy|thang cuốn|đường bộ|ngã tư|đèn giao thông|du lịch|khách sạn|vé tàu|vé xe|xe hơi|xe)\b", "v"),
        (r"\b(lên xe|xuống xe|bến xe|sân bay)\b", "v"),
        (r"\b(densha|basu|takushii|hikouki|fune|jidousha|jitensha|shinkansen|chikatetsu|ryokou|hoteru|ootobai|erebeetaa|kuruma)\b", "r"),
        (r"^(くるま)$", "w"),
    ]),

    # 11. School & Work
    ("school_work", [
        (r"\b(trường học|lớp học|bảng đen|bút chì|vở ghi|từ điển|sách giáo khoa|bài tập về nhà|bài kiểm tra|điểm số)\b", "v"),
        (r"\b(công việc|công ty|nhân viên|họp|công chức|nơi làm việc|văn phòng|ứng tuyển|lương|đồng nghiệp|giám đốc|trưởng phòng|báo cáo)\b", "v"),
        (r"\b(kyoushitsu|enpitsu|nooto|jisho|shukudai|shiken|shigoto|kaisha|kaigi|hataraku|houkoku)\b", "r"),
    ]),

    # 12. Money & Shopping
    ("money_shopping", [
        (r"\b(mua sắm|mua hàng|bán hàng|tiền|giá cả|rẻ|đắt tiền|ví tiền|cửa hàng|thanh toán|giá|đồng yên|thẻ tín dụng|chi tiêu|ngân sách|giảm giá|cửa hàng tiện lợi|miễn phí|quà tặng|rút tiền)\b", "v"),
        (r"\b(kaimono|okane|nedan|kakaku|yasui|takai|kurejittokaado|purezento)\b", "r"),
    ]),

    # 13. Places & Directions
    ("places_directions", [
        (r"\b(nhà ga|ngân hàng|bưu điện|hiệu sách|siêu thị|công viên|nhà máy|trường tiểu học|trường trung học|đại học|thành phố|làng|đảo|quốc gia|nhật bản|trung quốc|nước ngoài|khu phố|thị trấn|địa điểm|sân ga|cảnh sát)\b", "v"),
        (r"\b(đông|tây|nam|bắc|bên phải|bên trái|phía bên trái|phía bên phải|phía trên|phía dưới|phía trước|phía sau|bên trong|bên ngoài|bên cạnh|kế bên)\b", "v"),
        (r"\b(eki|ginkou|yuubinkyoku|kouen|koujo|daigaku|koukou|shougakkou|higashi|nishi|minami|kita|migi|hidari|ue|shita|soto|naka|mae|ushiro|koko|soko|asoko|machi|shigai|mura|shima|kuni|nihon|chuugoku|gaikoku|tonari|keisatsu|hoomu)\b", "r"),
    ]),

    # 14. Technology & Communication
    ("technology_communication", [
        (r"\b(điện thoại|điện thoại di động|điện thoại thông minh|máy tính|internet|email|radio|ảnh chụp|máy ảnh|liên lạc|truyền thông|chụp ảnh|mạng xã hội|dịch vụ|tivi|ti vi)\b", "v"),
        (r"\b(denwa|keitai|sumaho|pasokon|terebi|rajio|shashin|kamera|saabisu)\b", "r"),
    ]),

    # 15. Emotions & Personality
    ("emotions_personality", [
        (r"\b(thích|ghét|vui mừng|vui vẻ|buồn|sợ hãi|cảm xúc|cô đơn|tức giận|lo lắng|ngạc nhiên|giật mình|tử tế|dễ chịu|khó chịu|hài lòng|bực bội|căng thẳng|hạnh phúc|tình yêu|yên tâm|táo bạo|gan dạ)\b", "v"),
        (r"\b(suki|kirai|ureshii|kanashii|tanoshii|kowai|kimochi|sabishii|shinsetsu|yasashii|anshin|shinpai|bikkuri|daitan)\b", "r"),
    ]),

    # 16. Society, Culture & Business
    ("society_culture_business", [
        (r"\b(xã hội|chính trị|chính phủ|tin tức|báo chí|lễ hội|ngày lễ|truyền thống|văn hóa|kinh tế|quảng cáo|phong tục|tôn giáo|lời khuyên|khuyến cáo)\b", "v"),
        (r"\b(shakai|seiji|seifu|nyuusu|shimbun|shinbun|matsuri|shukujitsu|chuukoku)\b", "r"),
    ]),

    # 17. Thinking & Abstract
    ("thinking_abstract", [
        (r"\b(suy nghĩ|hiểu rõ|quyết định|khái niệm|ý tưởng|tin tưởng|khác nhau|giống nhau|điều kiện|khả năng|lý do|mục đích|kết quả|nguyên nhân|tâm|lòng|lỗi tại)\b", "v"),
        (r"\b(kangaeru|shiru|wakaru|kimeru)\b", "r"),
    ]),

    # 18. Actions (general verbs)
    ("actions_general", [
        (r"\b(vào|ra|đi ra|xem|nhìn|nghe|đọc|nói|nói chuyện|mua|bán|làm|chế tạo|rửa|giặt|đứng|ngồi|chạy|đi bộ|dừng|bắt đầu|kết thúc|tạo ra|giúp đỡ|sửa chữa|phá|mở|đóng|tìm kiếm|cắt|ném|đẩy|kéo|nhặt lên|đặt xuống|nhớ|quên|cố gắng|thử|nhận|cho|đưa|hạ xuống|xuống|trở về|về)\b", "v"),
        (r"\b(miru|kiku|yomu|hanasu|hairu|deru|aruku|hashiru|tatsu|suwaru|hajimeru|owaru|tsukuru|ageru|morau|kureru|arau|naosu|akeru|shimeru|sagasu|miseru|kiru|shaberu|oshaberi|tsukau|oru|irassharu|nasaru|oriru|orosu|kaeru)\b", "r"),
        (r"^(かえる|おりる|おろす)$", "w"),
    ]),

    # 19. Grammar words (greetings, particles, common pronouns, adverbs)
    ("grammar_words", [
        (r"\b(xin chào|tạm biệt|cảm ơn|xin lỗi|chúc mừng|alô|thất lễ|vâng|ừ|dạ)\b", "v"),
        (r"\b(rất|nhiều|ít|khá|tương đối|thường xuyên|hay|luôn luôn|thỉnh thoảng|nếu|ngay|cuối cùng|sắp|hoàn toàn|hầu hết|rõ ràng|giữ nguyên|quả nhiên|vẫn|chỉ|hơn|lại|nữa|và|nhưng|vì vậy|tuy nhiên)\b", "v"),
        (r"\b(kono|sono|ano|donna|konna|sonna|ookii|chiisai|atarashii|furui|nagai|mijikai|hiroi|semai|futoi|hikui|omoi|karui|tsuyoi|yowai|chikai|tooi|benri|fuben|marui|amai|karai|nigai|utsukushii|atatakai|suzushii|atsui|samui|tsumetai|hayai|osoi|yoku|takusan|itsumo|tokidoki|moshi|dake|yori|aru|iru|ii|kuroi|shiroi|aoi|kiiroi|akai|chairoi|hotondo|madamada|chanto|hakkiri|yappari|naruhodo|sukkari|nakanaka|zehi|kitto|soshite|mata|douka|hee|tada|tokei|hon|kasa|guruupu|booru|piano|geemu|omocha|konsaato|kurabu|chansu|deeto|koremade|hidoi|yahari|mama|sei|biru|sain|hajimemashite|yoroshiku|dochira|dotchi|kotchi|itsu|naze|doushite|dou|sou|kou|kouiu|douiu|donata|sorosoro|itsudemo)\b", "r"),
    ]),
]

def classify_word(word):
    m = word["meaning"].lower()
    r = word["romaji"].lower()
    w = word["word"]

    for cat, rules in RULES:
        for pattern, field in rules:
            if field == "v":
                target = m
            elif field == "r":
                target = r
            else:
                target = w
            
            if re.search(pattern, target, re.IGNORECASE):
                return cat
    return "other"

def main():
    with open(DATA, "r", encoding="utf-8") as f:
        words = json.load(f)

    updated = 0
    cat_counts = {}
    for word in words:
        old_cat = word.get("category", "other")
        new_cat = classify_word(word)
        word["category"] = new_cat
        if old_cat != new_cat:
            updated += 1
        cat_counts[new_cat] = cat_counts.get(new_cat, 0) + 1

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

    print(f"Successfully re-categorized {len(words)} words ({updated} entries changed).")
    print("\nCategory Distribution:")
    for cat, count in sorted(cat_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {cat}: {count}")

if __name__ == "__main__":
    main()
