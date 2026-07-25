#!/usr/bin/env python3
"""
Assign a 'category' to every word in jlpt-words.json.
Uses substring matching on Vietnamese meaning + romaji patterns.
"""

import json, re
from pathlib import Path

ROOT = Path(__file__).parent.parent
DATA = ROOT / "src" / "data" / "jlpt-words.json"

# ── Category rules: (category, [(field, substring), ...]) ────────────────────
# field: 'v' = Vietnamese meaning, 'r' = romaji
# All substrings are checked; first matching category wins.

RULES = [
    # Time – check early (many time words are short/common)
    ("time_calendar", [
        ("v", "giờ"), ("v", "phút"), ("v", "giây"),
        ("v", "buổi sáng"), ("v", "buổi trưa"), ("v", "buổi chiều"),
        ("v", "buổi tối"), ("v", "ban đêm"), ("v", "sáng sớm"),
        ("v", "hôm nay"), ("v", "ngày mai"), ("v", "hôm qua"),
        ("v", "ngày kia"), ("v", "hôm kia"),
        ("v", "tuần này"), ("v", "tháng này"), ("v", "năm nay"),
        ("v", "tuần tới"), ("v", "tháng tới"), ("v", "năm tới"),
        ("v", "tuần trước"), ("v", "tháng trước"), ("v", "năm ngoái"),
        ("v", "mùa xuân"), ("v", "mùa hè"), ("v", "mùa thu"), ("v", "mùa đông"),
        ("v", "thứ hai"), ("v", "thứ ba"), ("v", "thứ tư"),
        ("v", "thứ năm"), ("v", "thứ sáu"), ("v", "thứ bảy"), ("v", "chủ nhật"),
        ("v", "tháng một"), ("v", "tháng hai"), ("v", "tháng ba"),
        ("v", "tháng tư"), ("v", "tháng năm"), ("v", "tháng sáu"),
        ("v", "tháng bảy"), ("v", "tháng tám"), ("v", "tháng chín"),
        ("v", "tháng mười"), ("v", "năm mới"), ("v", "tết"),
        ("v", "khoảng thời gian"), ("v", "thời gian"),
        ("v", "bây giờ"), ("v", "lúc này"), ("v", "hiện tại"),
        ("v", "quá khứ"), ("v", "tương lai"), ("v", "lịch"),
        ("v", "bất cứ lúc nào"), ("v", "sắp, đến lúc"),
        ("r", "gatsu"), ("r", "nichi"), ("r", "youbi"),
        ("r", "jikan"), ("r", "fun"), ("r", "pun"),
        ("r", "asa"), ("r", "hiru"), ("r", "yoru"), ("r", "ban"),
        ("r", "kyou"), ("r", "ashita"), ("r", "kinou"),
        ("r", "konshu"), ("r", "kongetsu"), ("r", "kotoshi"),
        ("r", "raishu"), ("r", "raigetsu"), ("r", "rainen"),
        ("r", "senshu"), ("r", "sengetsu"), ("r", "sakunen"),
        ("r", "haru"), ("r", "natsu"), ("r", "aki"), ("r", "fuyu"),
        ("r", "gozen"), ("r", "gogo"), ("r", "ima"),
    ]),

    # Numbers
    ("numbers_counting", [
        ("v", "một"), ("v", "hai mươi"), ("v", "ba mươi"),
        ("v", "trăm"), ("v", "nghìn"), ("v", "vạn"), ("v", "triệu"),
        ("v", "mấy lần"), ("v", "ngày mấy"), ("v", "mấy ngày"),
        ("v", "mấy độ"), ("v", "số lượng"), ("v", "bao nhiêu"),
        ("v", "đếm"), ("v", "con số"),
        ("r", "futatsu"), ("r", "mittsu"), ("r", "yottsu"), ("r", "itsutsu"),
        ("r", "muttsu"), ("r", "nanatsu"), ("r", "yattsu"), ("r", "kokonotsu"),
        ("r", "suuryou"), ("r", "kazu"),
    ]),

    # Family & People
    ("family_people", [
        ("v", "bố"), ("v", "mẹ"), ("v", "cha"), ("v", "con trai"), ("v", "con gái"),
        ("v", "anh trai"), ("v", "chị gái"), ("v", "em trai"), ("v", "em gái"),
        ("v", "ông"), ("v", "bà"), ("v", "chú"), ("v", "bác"), ("v", "dì"), ("v", "cô"),
        ("v", "gia đình"), ("v", "bạn bè"), ("v", "kết hôn"), ("v", "vợ"), ("v", "chồng"),
        ("v", "bé trai"), ("v", "bé gái"), ("v", "trẻ em"),
        ("v", "người nhật"), ("v", "người nước ngoài"),
        ("v", "cô ấy"), ("v", "anh ấy"), ("v", "bạn gái"), ("v", "bạn trai"),
        ("v", "hàng xóm"), ("v", "khách (người)"), ("v", "thanh niên"),
        ("v", "nữ giới"), ("v", "nam giới"),
        ("v", "con của bạn"), ("v", "vợ của bạn"),
        ("v", "người thân"), ("v", "cặp đôi"),
        ("r", "kazoku"), ("r", "tomodachi"), ("r", "kodomo"),
        ("r", "josei"), ("r", "dansei"),
        ("r", "musuko"), ("r", "musume"),
        ("r", "sofu"), ("r", "sobo"),
        ("r", "oji"), ("r", "oba"),
        ("r", "nihonjin"), ("r", "gaikokujin"),
        ("r", "watashi"), ("r", "boku"), ("r", "anata"), ("r", "kimi"),
        ("r", "kare"), ("r", "kanojo"),
        ("r", "otokonoko"), ("r", "onnanoko"),
        ("r", "otousan"), ("r", "okaasan"), ("r", "oniisan"), ("r", "oneesan"),
        ("r", "otouto"), ("r", "imouto"),
    ]),

    # Body & Health
    ("body_health", [
        ("v", "mắt"), ("v", "tai"), ("v", "mũi"), ("v", "miệng"),
        ("v", "ngón tay"), ("v", "ngón chân"),
        ("v", "đầu"), ("v", "cổ"), ("v", "vai"), ("v", "ngực"), ("v", "bụng"), ("v", "lưng"),
        ("v", "bệnh viện"), ("v", "bác sĩ"), ("v", "y tá"), ("v", "thuốc"),
        ("v", "sức khỏe"), ("v", "cơ thể"), ("v", "thân thể"),
        ("v", "cảm cúm"), ("v", "cảm lạnh"), ("v", "sốt"), ("v", "đau"),
        ("v", "bị thương"), ("v", "chữa bệnh"), ("v", "phẫu thuật"),
        ("v", "khỏe mạnh"), ("v", "bệnh tật"), ("v", "triệu chứng"),
        ("r", "karada"), ("r", "byouki"), ("r", "kenko"),
        ("r", "byouin"), ("r", "isha"), ("r", "kusuri"),
        ("r", "atama"), ("r", "nodo"), ("r", "mune"), ("r", "hara"),
        ("r", "me"), ("r", "mimi"), ("r", "hana"), ("r", "kuchi"),
        ("r", "ude"), ("r", "koshi"), ("r", "senaka"),
    ]),

    # Food & Drink
    ("food_drink", [
        ("v", "ăn"), ("v", "uống"),
        ("v", "nước uống"), ("v", "nước lọc"), ("v", "nước (uống)"),
        ("v", "trà"), ("v", "cơm"), ("v", "bánh mì"), ("v", "thịt"), ("v", "cá"),
        ("v", "rau"), ("v", "hoa quả"), ("v", "trứng"), ("v", "pizza"),
        ("v", "salad"), ("v", "súp"),
        ("v", "bữa ăn"), ("v", "bữa sáng"), ("v", "bữa trưa"), ("v", "bữa tối"),
        ("v", "cà phê"), ("v", "sữa"), ("v", "bia"), ("v", "rượu"),
        ("v", "nước trái cây"), ("v", "thực phẩm"), ("v", "đồ ăn"), ("v", "đồ uống"),
        ("v", "kem"), ("v", "muối"), ("v", "đường (ngọt)"), ("v", "nước tương"),
        ("v", "cà chua"), ("v", "cà rốt"), ("v", "hành tây"), ("v", "khoai tây"),
        ("v", "chuối"), ("v", "táo"), ("v", "dâu tây"),
        ("v", "sushi"), ("v", "ramen"), ("v", "udon"), ("v", "soba"), ("v", "đậu phụ"),
        ("v", "cơm nắm"), ("v", "cơm hộp"), ("v", "thực đơn"),
        ("v", "ngon"), ("v", "cay"), ("v", "ngọt"), ("v", "đắng"), ("v", "mặn"),
        ("v", "bánh quy"), ("v", "kẹo cao su"), ("v", "mứt"),
        ("v", "bánh kem"), ("v", "bánh"),
        ("r", "taberu"), ("r", "nomu"), ("r", "shokuji"),
        ("r", "gohan"), ("r", "pan"), ("r", "sushi"), ("r", "soba"),
        ("r", "ramen"), ("r", "udon"), ("r", "tofu"),
        ("r", "kohii"), ("r", "miruku"), ("r", "gyuunyuu"), ("r", "juusu"),
        ("r", "biiru"), ("r", "sake"), ("r", "wain"),
        ("r", "yasai"), ("r", "kudamono"), ("r", "tamago"),
        ("r", "shio"), ("r", "satou"), ("r", "shouyu"),
        ("r", "ringo"), ("r", "ichigo"), ("r", "banana"),
    ]),

    # Home & Daily Life
    ("home_daily_life", [
        ("v", "nhà ở"), ("v", "căn nhà"), ("v", "phòng"), ("v", "cửa ra vào"),
        ("v", "cửa sổ"), ("v", "vườn"), ("v", "bếp"), ("v", "phòng tắm"),
        ("v", "nhà vệ sinh"), ("v", "lối vào"), ("v", "sàn nhà"), ("v", "tường"),
        ("v", "dọn dẹp"), ("v", "giặt đồ"), ("v", "nấu ăn"),
        ("v", "ngủ"), ("v", "thức dậy"),
        ("v", "sống"), ("v", "sinh sống"), ("v", "cuộc sống hàng ngày"),
        ("v", "đồ đạc"), ("v", "bàn (đồ vật)"), ("v", "ghế"), ("v", "sofa"),
        ("v", "giường"), ("v", "tủ lạnh"), ("v", "bát đĩa"),
        ("v", "cốc"), ("v", "ly"), ("v", "chăn"), ("v", "gối"), ("v", "khăn"),
        ("v", "chuyển nhà"), ("v", "đèn điện"), ("v", "điều hòa"),
        ("v", "đồ bỏ quên"), ("v", "cất đi, dọn"), ("v", "rác"),
        ("r", "ie"), ("r", "uchi"), ("r", "heya"),
        ("r", "daidokoro"), ("r", "furo"), ("r", "toire"),
        ("r", "genkan"), ("r", "niwa"),
        ("r", "souji"), ("r", "sentaku"), ("r", "ryouri"),
        ("r", "neru"), ("r", "okiru"), ("r", "sumu"),
        ("r", "beddo"), ("r", "reizouko"), ("r", "sofaa"),
        ("r", "wasuremono"), ("r", "gomi"), ("r", "shimau"),
        ("r", "futon"), ("r", "kagu"),
        ("r", "sara"), ("r", "chawan"), ("r", "koppu"),
    ]),

    # Clothing & Appearance
    ("clothing_appearance", [
        ("v", "quần áo"), ("v", "áo sơ mi"), ("v", "cà vạt"), ("v", "tất"), ("v", "giày"),
        ("v", "dép"), ("v", "mũ"), ("v", "kính mắt"), ("v", "túi xách"), ("v", "ví"),
        ("v", "kimono"), ("v", "áo khoác"), ("v", "đồng phục"),
        ("v", "trang phục"), ("v", "vẻ ngoài"), ("v", "khuôn mặt"),
        ("v", "tóc"), ("v", "trang điểm"), ("v", "ô, dù"), ("v", "ô (dù)"),
        ("v", "bộ vest"), ("v", "vali"),
        ("r", "fuku"), ("r", "shatsu"), ("r", "kutsu"), ("r", "boushi"),
        ("r", "megane"), ("r", "kaban"), ("r", "saifu"),
        ("r", "kimono"), ("r", "yukata"), ("r", "kooto"),
        ("r", "kasa"), ("r", "suutsu"), ("r", "suutsukeesu"),
        ("r", "nekutai"), ("r", "kutsushita"),
    ]),

    # Nature & Weather
    ("nature_weather", [
        ("v", "thời tiết"), ("v", "mưa"), ("v", "nắng"), ("v", "mây"),
        ("v", "tuyết"), ("v", "gió"), ("v", "sấm chớp"), ("v", "bão"), ("v", "động đất"),
        ("v", "biển"), ("v", "núi"), ("v", "sông"), ("v", "rừng"), ("v", "bầu trời"),
        ("v", "sao (thiên văn)"), ("v", "mặt trăng"), ("v", "mặt trời"),
        ("v", "thiên nhiên"), ("v", "hoa anh đào"),
        ("r", "tenki"), ("r", "ame"), ("r", "hare"), ("r", "kumo"), ("r", "yuki"),
        ("r", "kaze"), ("r", "kaminari"), ("r", "taifuu"), ("r", "jishin"),
        ("r", "umi"), ("r", "yama"), ("r", "kawa"), ("r", "mori"), ("r", "sora"),
        ("r", "hoshi"), ("r", "taiyou"), ("r", "shizen"), ("r", "sakura"),
    ]),

    # Animals & Plants
    ("animals_plants", [
        ("v", "chó"), ("v", "mèo"), ("v", "chim"), ("v", "ngựa"), ("v", "bò"),
        ("v", "lợn"), ("v", "heo"), ("v", "khỉ"), ("v", "thỏ"), ("v", "rùa"),
        ("v", "rắn"), ("v", "ếch"), ("v", "gấu"), ("v", "hổ"),
        ("v", "động vật"), ("v", "thực vật"), ("v", "hoa"), ("v", "cây"), ("v", "cỏ"), ("v", "lá"),
        ("v", "côn trùng"), ("v", "bướm"), ("v", "muỗi"),
        ("r", "inu"), ("r", "neko"), ("r", "tori"), ("r", "uma"), ("r", "ushi"),
        ("r", "buta"), ("r", "saru"), ("r", "usagi"), ("r", "kame"), ("r", "hebi"),
        ("r", "kaeru"), ("r", "tora"), ("r", "kuma"),
        ("r", "doubutsu"), ("r", "shokubutsu"),
    ]),

    # Places & Directions
    ("places_directions", [
        ("v", "nhà ga"), ("v", "ngân hàng"), ("v", "bưu điện"), ("v", "hiệu sách"),
        ("v", "siêu thị"), ("v", "công viên"), ("v", "nhà máy"),
        ("v", "trường tiểu học"), ("v", "trường trung học"), ("v", "đại học"),
        ("v", "đông (hướng)"), ("v", "tây (hướng)"), ("v", "nam (hướng)"), ("v", "bắc (hướng)"),
        ("v", "bên phải"), ("v", "bên trái"), ("v", "phía bên trái"), ("v", "phía bên phải"),
        ("v", "phía trên"), ("v", "phía dưới"),
        ("v", "phía trước"), ("v", "phía sau"),
        ("v", "bên trong"), ("v", "bên ngoài"),
        ("v", "bên cạnh"), ("v", "kế bên"),
        ("v", "thành phố"), ("v", "làng"), ("v", "đảo"), ("v", "quốc gia"),
        ("v", "nhật bản"), ("v", "trung quốc"), ("v", "nước ngoài"),
        ("v", "tiếng trung"), ("v", "ngoại ngữ"),
        ("v", "khu phố"), ("v", "thị trấn"), ("v", "địa điểm"),
        ("v", "sân ga"), ("v", "cảnh sát"),
        ("v", "phía nào, đâu"), ("v", "phía nào"),
        ("v", "bên này"), ("v", "bên nào"),
        ("r", "eki"), ("r", "ginkou"), ("r", "yuubinkyoku"),
        ("r", "kouen"), ("r", "koujo"),
        ("r", "daigaku"), ("r", "koukou"), ("r", "shougakkou"),
        ("r", "higashi"), ("r", "nishi"), ("r", "minami"), ("r", "kita"),
        ("r", "migi"), ("r", "hidari"), ("r", "ue"), ("r", "shita"),
        ("r", "soto"), ("r", "naka"), ("r", "mae"), ("r", "ushiro"),
        ("r", "koko"), ("r", "soko"), ("r", "asoko"),
        ("r", "machi"), ("r", "shigai"), ("r", "mura"), ("r", "shima"),
        ("r", "kuni"), ("r", "nihon"), ("r", "chuugoku"), ("r", "gaikoku"),
        ("r", "tonari"), ("r", "keisatsu"),
        ("r", "hoomu"),  # station platform
    ]),

    # Transportation
    ("transportation_travel", [
        ("v", "tàu điện"), ("v", "xe buýt"), ("v", "taxi"), ("v", "máy bay"),
        ("v", "tàu thủy"), ("v", "ô tô"), ("v", "xe đạp"),
        ("v", "tàu cao tốc"), ("v", "tàu điện ngầm"), ("v", "xe máy"),
        ("v", "thang máy"), ("v", "thang cuốn"),
        ("v", "đường bộ"), ("v", "ngã tư"), ("v", "đèn giao thông"),
        ("v", "du lịch"), ("v", "khách sạn"), ("v", "vé tàu"), ("v", "vé xe"),
        ("v", "lên xe, đi bằng"), ("v", "lên xe"), ("v", "xuống xe"),
        ("v", "về, trở về"), ("v", "khởi hành"), ("v", "đến nơi"),
        ("r", "densha"), ("r", "basu"), ("r", "takushii"), ("r", "hikouki"),
        ("r", "fune"), ("r", "jidousha"), ("r", "jitensha"),
        ("r", "shinkansen"), ("r", "chikatetsu"),
        ("r", "noru"), ("r", "oriru"),
        ("r", "ryokou"), ("r", "hoteru"),
        ("r", "ootobai"), ("r", "erebeetaa"),
    ]),

    # School & Work
    ("school_work", [
        ("v", "trường học"), ("v", "giáo viên"), ("v", "học sinh"), ("v", "sinh viên"),
        ("v", "toán học"), ("v", "lịch sử"), ("v", "tiếng anh"), ("v", "tiếng nhật"),
        ("v", "lớp học"), ("v", "bảng đen"), ("v", "bút chì"), ("v", "vở ghi"),
        ("v", "từ điển"), ("v", "sách giáo khoa"),
        ("v", "bài tập về nhà"), ("v", "bài kiểm tra"), ("v", "điểm số"),
        ("v", "công việc"), ("v", "công ty"), ("v", "nhân viên"), ("v", "họp"),
        ("v", "công chức"), ("v", "nơi làm việc"), ("v", "văn phòng"),
        ("v", "ứng tuyển"), ("v", "lương"),
        ("r", "gakkou"), ("r", "sensei"), ("r", "seito"), ("r", "gakusei"),
        ("r", "kyoushitsu"), ("r", "enpitsu"), ("r", "nooto"), ("r", "jisho"),
        ("r", "shukudai"), ("r", "shiken"),
        ("r", "shigoto"), ("r", "kaisha"), ("r", "kaigi"), ("r", "hataraku"),
    ]),

    # Technology
    ("technology_communication", [
        ("v", "điện thoại"), ("v", "điện thoại di động"), ("v", "điện thoại thông minh"),
        ("v", "máy tính"), ("v", "internet"), ("v", "email"),
        ("v", "radio"), ("v", "ảnh chụp"), ("v", "máy ảnh"),
        ("v", "liên lạc"), ("v", "truyền thông"),
        ("v", "chụp ảnh"), ("v", "mạng xã hội"), ("v", "dịch vụ"),
        ("v", "tivi"), ("v", "ti vi"),
        ("r", "denwa"), ("r", "keitai"), ("r", "sumaho"), ("r", "pasokon"),
        ("r", "terebi"), ("r", "rajio"), ("r", "shashin"), ("r", "kamera"),
        ("r", "saabisu"),
    ]),

    # Money & Shopping
    ("money_shopping", [
        ("v", "mua sắm"), ("v", "mua hàng"), ("v", "bán hàng"), ("v", "tiền"),
        ("v", "giá cả"), ("v", "rẻ"), ("v", "đắt tiền"), ("v", "ví tiền"),
        ("v", "cửa hàng"), ("v", "thanh toán"), ("v", "giá"), ("v", "đồng yên"),
        ("v", "thẻ tín dụng"), ("v", "chi tiêu"), ("v", "ngân sách"),
        ("v", "giảm giá"), ("v", "cửa hàng tiện lợi"), ("v", "miễn phí"),
        ("v", "quà tặng"),
        ("r", "kaimono"), ("r", "okane"), ("r", "nedan"), ("r", "kakaku"),
        ("r", "yasui"), ("r", "takai"),
        ("r", "kurejittokaado"), ("r", "purezento"),
    ]),

    # Emotions & Personality
    ("emotions_personality", [
        ("v", "thích"), ("v", "ghét"), ("v", "vui mừng"), ("v", "vui, thú vị"),
        ("v", "vui vẻ"), ("v", "buồn"), ("v", "sợ hãi"),
        ("v", "cảm xúc"), ("v", "cô đơn"), ("v", "tức giận"),
        ("v", "lo lắng"), ("v", "ngạc nhiên"), ("v", "giật mình"),
        ("v", "tử tế"), ("v", "dễ chịu"), ("v", "khó chịu"),
        ("v", "hài lòng"), ("v", "bực bội"), ("v", "căng thẳng"),
        ("v", "hạnh phúc"), ("v", "tình yêu"),
        ("v", "yên tâm"), ("v", "bẩn, dơ"), ("v", "tệ, quá đáng"),
        ("v", "lạnh (đồ vật)"),
        ("r", "suki"), ("r", "kirai"), ("r", "ureshii"), ("r", "kanashii"),
        ("r", "tanoshii"), ("r", "kowai"), ("r", "kimochi"), ("r", "sabishii"),
        ("r", "shinsetsu"), ("r", "yasashii"),
        ("r", "anshin"), ("r", "shinpai"), ("r", "bikkuri"),
    ]),

    # Society
    ("society_culture_business", [
        ("v", "xã hội"), ("v", "chính trị"), ("v", "chính phủ"),
        ("v", "tin tức"), ("v", "báo chí"),
        ("v", "lễ hội"), ("v", "ngày lễ"), ("v", "truyền thống"), ("v", "văn hóa"),
        ("v", "kinh tế"), ("v", "quảng cáo"),
        ("v", "phong tục"), ("v", "tôn giáo"),
        ("r", "shakai"), ("r", "seiji"), ("r", "seifu"),
        ("r", "nyuusu"), ("r", "shimbun"), ("r", "shinbun"),
        ("r", "matsuri"), ("r", "shukujitsu"),
    ]),

    # Thinking & Abstract
    ("thinking_abstract", [
        ("v", "suy nghĩ"), ("v", "hiểu rõ"), ("v", "quyết định"),
        ("v", "khái niệm"), ("v", "ý tưởng"), ("v", "tin tưởng"),
        ("v", "khác nhau"), ("v", "giống nhau"),
        ("v", "điều kiện"), ("v", "khả năng"), ("v", "lý do"),
        ("v", "mục đích"), ("v", "kết quả"), ("v", "nguyên nhân"),
        ("v", "tâm, lòng"), ("v", "lỗi tại"),
        ("r", "kangaeru"), ("r", "shiru"), ("r", "wakaru"),
        ("r", "kimeru"),
    ]),

    # Actions (general verbs)
    ("actions_general", [
        ("v", "vào"), ("v", "ra, đi ra"), ("v", "xem, nhìn"), ("v", "nghe"),
        ("v", "đọc"), ("v", "nói, nói chuyện"), ("v", "nói"),
        ("v", "mua"), ("v", "bán"), ("v", "làm, chế tạo"),
        ("v", "rửa, giặt"), ("v", "rửa"),
        ("v", "đứng"), ("v", "ngồi"), ("v", "chạy"), ("v", "đi bộ"),
        ("v", "dừng"), ("v", "bắt đầu"), ("v", "kết thúc"),
        ("v", "tạo ra"), ("v", "giúp đỡ"),
        ("v", "sửa chữa"), ("v", "phá"), ("v", "mở"), ("v", "đóng"),
        ("v", "tìm kiếm"), ("v", "cắt"), ("v", "ném"), ("v", "đẩy"), ("v", "kéo"),
        ("v", "nhặt lên"), ("v", "đặt xuống"),
        ("v", "nhớ"), ("v", "quên"), ("v", "cố gắng"), ("v", "thử"),
        ("v", "nhận, được cho"), ("v", "cho, tặng"),
        ("v", "cho (tôi)"), ("v", "cho, đưa"),
        ("v", "nói chuyện phiếm"), ("v", "tán gẫu"),
        ("v", "nói chuyện, tán gẫu"),
        ("v", "chữ ký"),
        ("v", "ở, có (khiêm nhường)"), ("v", "đến, ở (kính ngữ)"),
        ("v", "làm (kính ngữ)"),
        ("r", "miru"), ("r", "kiku"), ("r", "yomu"), ("r", "hanasu"),
        ("r", "hairu"), ("r", "deru"),
        ("r", "aruku"), ("r", "hashiru"), ("r", "tatsu"), ("r", "suwaru"),
        ("r", "hajimeru"), ("r", "owaru"), ("r", "tsukuru"),
        ("r", "ageru"), ("r", "morau"), ("r", "kureru"),
        ("r", "arau"), ("r", "naosu"), ("r", "akeru"), ("r", "shimeru"),
        ("r", "sagasu"), ("r", "miseru"), ("r", "kiru"),
        ("r", "shaberu"), ("r", "oshaberi"),
        ("r", "tsukau"),
        ("r", "oru"), ("r", "irassharu"), ("r", "nasaru"),
    ]),

    # Grammar words, adjectives, adverbs, particles, pronouns
    ("grammar_words", [
        # Colors
        ("v", "màu đỏ"), ("v", "màu trắng"), ("v", "màu đen"), ("v", "màu xanh"),
        ("v", "màu vàng"), ("v", "màu xanh lá"), ("v", "màu tím"),
        ("v", "màu cam"), ("v", "màu hồng"), ("v", "màu nâu"), ("v", "màu"),
        ("v", "trắng"), ("v", "đỏ"), ("v", "đen"), ("v", "xanh"), ("v", "vàng"), ("v", "nâu"),
        # Size / shape adjectives
        ("v", "to, lớn"), ("v", "nhỏ"), ("v", "mới"), ("v", "cũ"),
        ("v", "dài"), ("v", "ngắn"), ("v", "rộng"), ("v", "hẹp, chật"), ("v", "to, mập"),
        ("v", "thấp"), ("v", "nặng"), ("v", "nhẹ"), ("v", "mạnh"), ("v", "yếu"),
        ("v", "gần"), ("v", "xa"), ("v", "tiện lợi"), ("v", "bất tiện"),
        ("v", "tròn"), ("v", "dày"), ("v", "mỏng"),
        ("v", "nhanh"), ("v", "chậm, muộn"),
        # Sensory adjectives
        ("v", "đẹp (phong cảnh)"), ("v", "đẹp"),
        ("v", "nóng (thời tiết)"), ("v", "nóng"), ("v", "ấm"), ("v", "mát mẻ"),
        ("v", "lạnh"),
        # Adverbs
        ("v", "nhiều"), ("v", "ít"), ("v", "rất"), ("v", "khá, tương đối"),
        ("v", "thường xuyên"), ("v", "hay, thường"), ("v", "luôn luôn"),
        ("v", "thỉnh thoảng"), ("v", "nếu, giả sử"),
        ("v", "ngay lập tức"), ("v", "cuối cùng"), ("v", "sắp"), ("v", "vừa đúng"),
        ("v", "hoàn toàn"), ("v", "hầu hết"), ("v", "khá"),
        ("v", "rõ ràng"), ("v", "đàng hoàng"), ("v", "giữ nguyên"),
        ("v", "quả nhiên"), ("v", "vẫn còn"),
        ("v", "chỉ, chỉ có"), ("v", "hơn, so với"), ("v", "lại, nữa"),
        ("v", "xin, làm ơn"), ("v", "và, rồi"),
        ("v", "nhưng"), ("v", "vì vậy"), ("v", "tuy nhiên"),
        ("v", "ồ, thế à"), ("v", "ơ, hả"), ("v", "à"),
        ("v", "rất vui được gặp"),
        # Greetings
        ("v", "xin chào"), ("v", "tạm biệt"), ("v", "cảm ơn"), ("v", "xin lỗi"),
        ("v", "chúc mừng"), ("v", "alô"), ("v", "thất lễ"),
        ("v", "vâng"), ("v", "ừ"),
        # Common particles/determiners
        ("v", "như thế này"), ("v", "loại này"), ("v", "như thế nào"),
        ("v", "loại nào"), ("v", "vị nào, ai"),
        ("v", "...này"), ("v", "...nào"), ("v", "vậy, đúng vậy"),
        # Objects often used as grammar examples
        ("v", "đồng hồ"), ("v", "sách (cuốn)"), ("v", "ô, dù"),
        ("v", "cơ hội"), ("v", "hẹn hò"), ("v", "nhóm"), ("v", "quả bóng"),
        ("v", "đàn piano"), ("v", "cốc, ly"), ("v", "trò chơi"),
        ("v", "đồ chơi"), ("v", "buổi hòa nhạc"), ("v", "câu lạc bộ"),
        ("v", "cho đến nay"), ("v", "tốt, được"),
        ("v", "bộ, tổ, cặp"), ("v", "bước (đi bộ)"),
        # Adjectives about properties
        ("v", "tốt"), ("v", "xấu (tính cách)"), ("v", "thật"),
        ("v", "miễn phí"),
        # Romaji catch-all for particles/common words
        ("r", "kono"), ("r", "sono"), ("r", "ano"), ("r", "donna"), ("r", "konna"),
        ("r", "sonna"),
        ("r", "ookii"), ("r", "chiisai"), ("r", "atarashii"), ("r", "furui"),
        ("r", "nagai"), ("r", "mijikai"), ("r", "hiroi"), ("r", "semai"),
        ("r", "futoi"), ("r", "hikui"), ("r", "omoi"), ("r", "karui"),
        ("r", "tsuyoi"), ("r", "yowai"), ("r", "chikai"), ("r", "tooi"),
        ("r", "benri"), ("r", "fuben"),
        ("r", "marui"), ("r", "amai"), ("r", "karai"), ("r", "nigai"),
        ("r", "utsukushii"), ("r", "atatakai"), ("r", "suzushii"), ("r", "atsui"),
        ("r", "samui"), ("r", "tsumetai"),
        ("r", "hayai"), ("r", "osoi"),
        ("r", "yoku"), ("r", "takusan"), ("r", "itsumo"), ("r", "tokidoki"),
        ("r", "moshi"), ("r", "dake"), ("r", "yori"),
        ("r", "aru"), ("r", "iru"), ("r", "ii"),
        ("r", "kuroi"), ("r", "shiroi"), ("r", "aoi"), ("r", "kiiroi"),
        ("r", "akai"), ("r", "chairoi"),
        ("r", "hotondo"), ("r", "madamada"), ("r", "chanto"), ("r", "hakkiri"),
        ("r", "yappari"), ("r", "naruhodo"), ("r", "sukkari"),
        ("r", "nakanaka"), ("r", "zehi"), ("r", "kitto"),
        ("r", "soshite"), ("r", "mata"), ("r", "douka"),
        ("r", "hee"), ("r", "tada"),
        ("r", "tokei"), ("r", "hon"), ("r", "kasa"),
        ("r", "guruupu"), ("r", "booru"), ("r", "piano"),
        ("r", "geemu"), ("r", "omocha"), ("r", "konsaato"), ("r", "kurabu"),
        ("r", "chansu"), ("r", "deeto"),
        ("r", "koremade"), ("r", "hidoi"), ("r", "yahari"),
        ("r", "mama"), ("r", "sei"),
        ("r", "biru"), ("r", "sain"),
        ("r", "hajimemashite"), ("r", "yoroshiku"),
        ("r", "dochira"), ("r", "dotchi"), ("r", "kotchi"),
        ("r", "itsu"), ("r", "naze"), ("r", "doushite"),
        ("r", "dou"), ("r", "sou"), ("r", "kou"),
        ("r", "kouiu"), ("r", "douiu"),
        ("r", "donata"),
        ("r", "sorosoro"), ("r", "itsudemo"),
        ("r", "kaeru"),  # return home
        ("r", "mizu"),  # water - common word
        ("r", "terebi"),
    ]),
]

# ── flat lookup: (category, field, substring) ───────────────────────────────

def build_index():
    idx = []
    for cat, rules in RULES:
        for field, substr in rules:
            idx.append((cat, field, substr))
    return idx

INDEX = build_index()


def assign_category(word: dict) -> str:
    romaji = (word.get("romaji") or "").lower()
    meaning = (word.get("meaning") or "").lower()
    for cat, field, substr in INDEX:
        if field == "v":
            if substr in meaning:
                return cat
        else:  # 'r'
            if substr in romaji:
                return cat
    return "other"


def main():
    with open(DATA, encoding="utf-8") as f:
        words = json.load(f)

    counts = {}
    for w in words:
        cat = assign_category(w)
        w["category"] = cat
        counts[cat] = counts.get(cat, 0) + 1

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

    print(f"✅  Categorised {len(words)} words.")
    for cat, n in sorted(counts.items(), key=lambda x: -x[1]):
        print(f"  {cat:<35} {n}")

    other_words = [w for w in words if w["category"] == "other"]
    if other_words:
        print(f"\n⚠️  {len(other_words)} words still in 'other'. Sample (first 40):")
        for w in other_words[:40]:
            print(f"  {w['word']} ({w['romaji']}) = {w['meaning']}")


if __name__ == "__main__":
    main()
