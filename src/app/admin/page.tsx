"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Power,
  Calendar,
  Clock,
  MessageSquare,
  KeyRound,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Repeat,
  CalendarDays,
} from "lucide-react";
import { useMaintenance, parseVietnamDateTime } from "@/lib/maintenance-context";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const WEEKDAYS = [
  { day: 1, labelVi: "Thứ 2", labelEn: "Mon" },
  { day: 2, labelVi: "Thứ 3", labelEn: "Tue" },
  { day: 3, labelVi: "Thứ 4", labelEn: "Wed" },
  { day: 4, labelVi: "Thứ 5", labelEn: "Thu" },
  { day: 5, labelVi: "Thứ 6", labelEn: "Fri" },
  { day: 6, labelVi: "Thứ 7", labelEn: "Sat" },
  { day: 0, labelVi: "Chủ Nhật", labelEn: "Sun" },
];

export default function AdminPage() {
  const {
    config,
    isMaintenanceActive,
    activeReason,
    isAdminLoggedIn,
    verifyPin,
    changePin,
    updateConfig,
    logoutAdmin,
  } = useMaintenance();

  const { language } = useLanguage();
  const isVi = language === "vi";

  // Live Vietnam Time Clock State
  const [vnClock, setVnClock] = useState<string>("");

  useEffect(() => {
    const update = () => {
      setVnClock(
        new Date().toLocaleString(isVi ? "vi-VN" : "en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
          weekday: "short",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [isVi]);

  // PIN Form State
  const [inputPin, setInputPin] = useState("");
  const [pinError, setPinError] = useState("");

  // Change PIN State
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinChangeMsg, setPinChangeMsg] = useState({ text: "", isError: false });

  // Schedule Type
  const [scheduleType, setScheduleType] = useState<"one_time" | "recurring">(
    config.scheduleType || "one_time"
  );

  // One-Time Schedule Form State
  const [autoOff, setAutoOff] = useState(config.autoOffDateTime || "");
  const [autoOn, setAutoOn] = useState(config.autoOnDateTime || "");

  // Recurring Schedule Form State
  const [recurringDays, setRecurringDays] = useState<number[]>(
    config.recurringDays || [6, 0]
  );
  const [recurringStart, setRecurringStart] = useState(config.recurringStartTime || "15:00");
  const [recurringEnd, setRecurringEnd] = useState(config.recurringEndTime || "17:00");

  const [scheduleMsg, setScheduleMsg] = useState("");

  // Custom Message State
  const [messageInput, setMessageInput] = useState(config.customMessage || "");
  const [messageSavedMsg, setMessageSavedMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPin(inputPin)) {
      setPinError("");
      setInputPin("");
    } else {
      setPinError(isVi ? "Mã PIN không đúng. Mặc định là 1234." : "Incorrect PIN. Default is 1234.");
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.trim()) {
      setPinChangeMsg({ text: isVi ? "Vui lòng nhập mã PIN mới." : "Please enter a new PIN.", isError: true });
      return;
    }
    if (newPin !== confirmPin) {
      setPinChangeMsg({ text: isVi ? "Xác nhận mã PIN không khớp." : "PIN confirmation does not match.", isError: true });
      return;
    }
    changePin(newPin);
    setNewPin("");
    setConfirmPin("");
    setPinChangeMsg({ text: isVi ? "Đổi mã PIN thành công!" : "PIN updated successfully!", isError: false });
  };

  const toggleDay = (day: number) => {
    if (recurringDays.includes(day)) {
      setRecurringDays(recurringDays.filter((d) => d !== day));
    } else {
      setRecurringDays([...recurringDays, day]);
    }
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      scheduleType,
      autoOffDateTime: autoOff,
      autoOnDateTime: autoOn,
      recurringDays,
      recurringStartTime: recurringStart,
      recurringEndTime: recurringEnd,
    });
    setScheduleMsg(isVi ? "Đã lưu lịch trình tự động (Giờ VN - UTC+7)!" : "Auto schedule saved (Vietnam Time - UTC+7)!");
    setTimeout(() => setScheduleMsg(""), 3000);
  };

  const handleClearSchedule = () => {
    setAutoOff("");
    setAutoOn("");
    setRecurringDays([]);
    updateConfig({
      autoOffDateTime: "",
      autoOnDateTime: "",
      recurringDays: [],
    });
    setScheduleMsg(isVi ? "Đã xóa lịch trình tự động." : "Auto schedule cleared.");
    setTimeout(() => setScheduleMsg(""), 3000);
  };

  const handleSaveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({ customMessage: messageInput });
    setMessageSavedMsg(isVi ? "Đã lưu nội dung thông báo!" : "Message saved!");
    setTimeout(() => setMessageSavedMsg(""), 3000);
  };

  // 1. PIN CHALLENGE SCREEN (If not authenticated)
  if (!isAdminLoggedIn) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4 py-12">
        <div className="relative flex w-full max-w-md flex-col gap-6 rounded-3xl border bg-card p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Shield className="size-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isVi ? "Xác Thực Quản Trị Viên" : "Admin Authentication"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isVi
                ? "Vui lòng nhập mã PIN quản trị để truy cập trang cấu hình bật/tắt website."
                : "Enter admin PIN to access the site configuration panel."}
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {isVi ? "Mã PIN Quản Trị" : "Admin PIN"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                  placeholder={isVi ? "Nhập mã PIN (Mặc định: 1234)" : "Enter PIN (Default: 1234)"}
                  maxLength={10}
                  className="w-full rounded-xl border bg-background pl-10 pr-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring font-mono tracking-widest"
                  autoFocus
                />
              </div>
            </div>

            {pinError && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive font-medium">
                <AlertCircle className="size-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <Button type="submit" className="w-full font-bold gap-2 cursor-pointer py-5 text-sm">
              <KeyRound className="size-4" />
              <span>{isVi ? "Đăng Nhập Admin" : "Unlock Control Panel"}</span>
            </Button>
          </form>

          <div className="text-center border-t pt-4">
            <span className="text-[11px] text-muted-foreground">
              {isVi ? "Mã PIN ban đầu mặc định là " : "Initial default PIN is "}
              <strong className="text-foreground">1234</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. ADMIN DASHBOARD SCREEN (When authenticated)
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Shield className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight">
                {isVi ? "Bảng Điều Khiển Quản Trị (Admin Panel)" : "Admin Control Panel"}
              </h1>
              <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/10 font-bold text-xs">
                PIN Unlocked
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {isVi
                ? "Cấu hình tạm ngưng website, cài đặt lịch trình tự động bật/tắt theo Giờ Việt Nam (UTC+7) và quản lý mã PIN."
                : "Manage maintenance mode, automated schedules in Vietnam Time (UTC+7), and security PIN."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Vietnam Time Clock Pill */}
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
            <Clock className="size-4 shrink-0 animate-pulse text-amber-500" />
            <span>{vnClock || "Giờ Việt Nam (UTC+7)"}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={logoutAdmin}
            className="gap-2 shrink-0 font-semibold cursor-pointer border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="size-4" />
            <span>{isVi ? "Đăng xuất Admin" : "Logout Admin"}</span>
          </Button>
        </div>
      </div>

      {/* Main Grid Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: System Status & Manual Override */}
        <div className="flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-base">
              <Power className="size-5 text-amber-500" />
              <span>{isVi ? "Trạng Thái Hoạt Động Website" : "Website Maintenance Mode"}</span>
            </div>

            <Badge
              className={`font-bold px-3 py-1 text-xs ${
                isMaintenanceActive
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-emerald-500 text-white"
              }`}
            >
              {isMaintenanceActive
                ? isVi
                  ? "ĐANG BẢO TRÌ"
                  : "MAINTENANCE MODE"
                : isVi
                ? "HOẠT ĐỘNG BÌNH THƯỜNG"
                : "ONLINE"}
            </Badge>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border bg-muted/30 p-4 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">{isVi ? "Trạng thái hiện tại:" : "Current status:"}</span>
              <span className="font-bold text-foreground">
                {isMaintenanceActive
                  ? isVi
                    ? "Tắt truy cập (Bảo trì)"
                    : "Access Disabled"
                  : isVi
                  ? "Cho phép học viên truy cập"
                  : "Access Allowed"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">{isVi ? "Lý do kích hoạt:" : "Activation Reason:"}</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {activeReason === "manual"
                  ? isVi
                    ? "Công tắc thủ công (Manual)"
                    : "Manual Override"
                  : activeReason === "scheduled"
                  ? config.scheduleType === "recurring"
                    ? isVi
                      ? "Lịch trình lặp lại định kỳ (Recurring)"
                      : "Recurring Schedule"
                    : isVi
                    ? "Theo lịch trình tự động (Scheduled)"
                    : "Automated Schedule"
                  : isVi
                  ? "Không có"
                  : "None"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {isVi ? "Công Tắc Tắt/Bật Thủ Công (Instant Override)" : "Instant Manual Override"}
            </label>

            <Button
              variant={config.manualOverride ? "default" : "destructive"}
              onClick={() => updateConfig({ manualOverride: !config.manualOverride })}
              className="py-6 text-sm font-bold gap-2 cursor-pointer w-full"
            >
              <Power className="size-5" />
              <span>
                {config.manualOverride
                  ? isVi
                    ? "BẬT LẠI WEBSITE NGAY (Turn On Site)"
                    : "TURN ON SITE NOW"
                  : isVi
                  ? "TẠM TẮT WEBSITE NGAY (Turn Off Site)"
                  : "TURN OFF SITE NOW"}
              </span>
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">
              {isVi
                ? "Nút thủ công sẽ ngay lập tức bật hoặc tắt website độc lập với lịch hẹn."
                : "Manual toggle instantly enables or disables the website regardless of schedule."}
            </p>
          </div>
        </div>

        {/* Card 2: Automated Schedule (One-time vs Recurring) */}
        <div className="flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-base">
            <Calendar className="size-5 text-amber-500" />
            <span>{isVi ? "Lịch Trình Tự Động Bật/Tắt (Giờ VN - UTC+7)" : "Automated Schedule (Vietnam Time - UTC+7)"}</span>
          </div>

          {/* Schedule Type Selector Switcher */}
          <div className="flex items-center rounded-xl border bg-muted p-1 text-xs">
            <button
              type="button"
              onClick={() => setScheduleType("one_time")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 font-bold transition-all cursor-pointer ${
                scheduleType === "one_time"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays className="size-3.5" />
              <span>{isVi ? "Một lần (Ngày/Giờ VN)" : "One-time (Vietnam Time)"}</span>
            </button>

            <button
              type="button"
              onClick={() => setScheduleType("recurring")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 font-bold transition-all cursor-pointer ${
                scheduleType === "recurring"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Repeat className="size-3.5" />
              <span>{isVi ? "Lặp lại (Giờ VN UTC+7)" : "Recurring (Vietnam Time)"}</span>
            </button>
          </div>

          <form onSubmit={handleSaveSchedule} className="flex flex-col gap-4">
            {scheduleType === "one_time" ? (
              /* --- ONE-TIME SCHEDULE FIELDS --- */
              <div className="flex flex-col gap-4">
                <p className="text-xs text-muted-foreground">
                  {isVi
                    ? "Cấu hình ngày giờ (theo Giờ Việt Nam - UTC+7) để website TỰ ĐỘNG TẮT và TỰ ĐỘNG BẬT LẠI."
                    : "Set specific date & time (in Vietnam Time - UTC+7) for site to turn OFF and turn ON."}
                </p>

                {/* Auto Off Date Time */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Clock className="size-3.5 text-destructive" />
                    <span>{isVi ? "Thời gian TỰ ĐỘNG TẮT (Giờ VN - UTC+7):" : "Auto Turn OFF (Vietnam Time UTC+7):"}</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={autoOff}
                    onChange={(e) => setAutoOff(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-mono ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                {/* Auto On Date Time */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Clock className="size-3.5 text-emerald-500" />
                    <span>{isVi ? "Thời gian TỰ ĐỘNG BẬT LẠI (Giờ VN - UTC+7):" : "Auto Turn ON (Vietnam Time UTC+7):"}</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={autoOn}
                    onChange={(e) => setAutoOn(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-mono ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
            ) : (
              /* --- RECURRING SCHEDULE FIELDS --- */
              <div className="flex flex-col gap-4">
                <p className="text-xs text-muted-foreground">
                  {isVi
                    ? "Tự động tắt website vào các ngày trong tuần theo Giờ Việt Nam (UTC+7) trong khung giờ nhất định (Ví dụ: Thứ 7, Chủ Nhật từ 15:00 - 17:00)."
                    : "Automatically turn off site on selected days in Vietnam Time (UTC+7) during a daily time window (e.g., Sat, Sun 15:00 - 17:00)."}
                </p>

                {/* Weekday Selection Pills */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-muted-foreground">
                    {isVi ? "Chọn ngày lặp lại trong tuần:" : "Select recurring days:"}
                  </label>

                  <div className="flex flex-wrap gap-1.5">
                    {WEEKDAYS.map((w) => {
                      const isSelected = recurringDays.includes(w.day);
                      return (
                        <button
                          key={w.day}
                          type="button"
                          onClick={() => toggleDay(w.day)}
                          className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-500 text-white shadow-2xs"
                              : "border border-input bg-background text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          {isVi ? w.labelVi : w.labelEn}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Daily Time Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3 text-destructive" />
                      <span>{isVi ? "Giờ tắt (Giờ VN):" : "Turn Off Time (VN):"}</span>
                    </label>
                    <input
                      type="time"
                      value={recurringStart}
                      onChange={(e) => setRecurringStart(e.target.value)}
                      className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-mono ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3 text-emerald-500" />
                      <span>{isVi ? "Giờ mở lại (Giờ VN):" : "Turn On Time (VN):"}</span>
                    </label>
                    <input
                      type="time"
                      value={recurringEnd}
                      onChange={(e) => setRecurringEnd(e.target.value)}
                      className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-mono ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </div>
            )}

            {scheduleMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{scheduleMsg}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Button type="submit" size="sm" className="flex-1 font-bold gap-1.5 cursor-pointer">
                <CheckCircle2 className="size-4" />
                <span>{isVi ? "Lưu Lịch Trình" : "Save Schedule"}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearSchedule}
                className="font-semibold cursor-pointer text-muted-foreground"
              >
                {isVi ? "Xóa Lịch" : "Clear"}
              </Button>
            </div>
          </form>
        </div>

        {/* Card 3: Custom Visitor Message */}
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-base">
            <MessageSquare className="size-5 text-amber-500" />
            <span>{isVi ? "Thông Báo Bảo Trì Cho Học Viên" : "Visitor Maintenance Notice"}</span>
          </div>

          <form onSubmit={handleSaveMessage} className="flex flex-col gap-3">
            <textarea
              rows={3}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={isVi ? "Nhập lời nhắn thông báo bảo trì..." : "Enter maintenance notice for visitors..."}
              className="w-full rounded-xl border bg-background p-3 text-xs leading-relaxed ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            />

            {messageSavedMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{messageSavedMsg}</span>
              </div>
            )}

            <Button type="submit" size="sm" variant="outline" className="font-bold gap-1.5 self-start cursor-pointer">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>{isVi ? "Lưu Thông Báo" : "Save Notice"}</span>
            </Button>
          </form>
        </div>

        {/* Card 4: Change Security PIN */}
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-base">
            <KeyRound className="size-5 text-amber-500" />
            <span>{isVi ? "Đổi Mã PIN Quản Trị" : "Change Security PIN"}</span>
          </div>

          <form onSubmit={handleChangePin} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder={isVi ? "Mã PIN mới" : "New PIN"}
                maxLength={10}
                className="rounded-xl border bg-background px-3 py-2 text-xs font-mono tracking-widest ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              />

              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder={isVi ? "Xác nhận PIN" : "Confirm PIN"}
                maxLength={10}
                className="rounded-xl border bg-background px-3 py-2 text-xs font-mono tracking-widest ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {pinChangeMsg.text && (
              <div
                className={`flex items-center gap-2 rounded-lg p-2 text-xs font-semibold ${
                  pinChangeMsg.isError
                    ? "bg-destructive/10 text-destructive"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {pinChangeMsg.isError ? (
                  <AlertCircle className="size-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="size-4 shrink-0" />
                )}
                <span>{pinChangeMsg.text}</span>
              </div>
            )}

            <Button type="submit" size="sm" variant="outline" className="font-bold gap-1.5 self-start cursor-pointer">
              <KeyRound className="size-4 text-amber-500" />
              <span>{isVi ? "Đổi Mã PIN" : "Update PIN"}</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
