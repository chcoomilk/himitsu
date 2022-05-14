import { AppThemeSetting } from "./utils/types";

function increase_brightness(hex: string, percent: number) {
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);

    return '#' +
        ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).slice(1) +
        ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).slice(1) +
        ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).slice(1);
}

function increase_brightness_linear(color: string, percent: number) {
    var num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = ((num >> 8) & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
};

// const invert_color = (hex: string) => '#' + hex.match(/[a-f0-9]{2}/ig)?.map(e => (255 - parseInt(e, 16) | 0).toString(16).replace(/^([a-f0-9])$/, '0$1')).join('');

export const applyTheme = (theme: AppThemeSetting) => {
    let base_bg_color: string, base_text_color: string, css = document.documentElement.style;
    switch (theme) {
        case AppThemeSetting.Normal:
            base_bg_color = "#282C34";
            base_text_color = "#FFFFFF";
            css.setProperty("--himitsu-bg", increase_brightness(base_bg_color, 4));
            css.setProperty("--himitsu-body-bg", base_bg_color);
            css.setProperty("--bs-body-bg", base_bg_color);
            css.setProperty("--himitsu-input-bg", increase_brightness(base_bg_color, 4));
            css.setProperty("--himitsu-input-border", increase_brightness(base_bg_color, -2));
            css.setProperty("--himitsu-input-disabled-bg", increase_brightness_linear(base_bg_color, -2));
            css.setProperty("--himitsu-input-disabled-border", increase_brightness_linear(base_bg_color, -5));
            css.setProperty("--himitsu-color-darken", increase_brightness_linear((base_text_color), -25));
            css.setProperty("--bs-body-color", (base_text_color));
            break;
        case AppThemeSetting.Black:
            base_bg_color = "#000000";
            base_text_color = "#CCCCCC";
            css.setProperty("--himitsu-bg", increase_brightness(base_bg_color, 4));
            css.setProperty("--himitsu-body-bg", base_bg_color);
            css.setProperty("--bs-body-bg", base_bg_color);
            css.setProperty("--himitsu-input-bg", increase_brightness(base_bg_color, 4));
            css.setProperty("--himitsu-input-border", increase_brightness(base_bg_color, 4));
            css.setProperty("--himitsu-input-disabled-bg", increase_brightness_linear(base_bg_color, 3));
            css.setProperty("--himitsu-input-disabled-border", increase_brightness(base_bg_color, 4));
            css.setProperty("--himitsu-color", (base_text_color));
            css.setProperty("--himitsu-color-darken", increase_brightness_linear((base_text_color), -25));
            css.setProperty("--bs-body-color", (base_text_color));
            break;
        default:
            base_bg_color = "#282C34";
            base_text_color = "#FFFFFF";
            css.setProperty("--himitsu-bg", increase_brightness(base_bg_color, 4));
            css.setProperty("--himitsu-body-bg", base_bg_color);
            css.setProperty("--bs-body-bg", base_bg_color);
            css.setProperty("--himitsu-input-bg", increase_brightness(base_bg_color, 4));
            css.setProperty("--himitsu-input-border", increase_brightness(base_bg_color, 4));
            css.setProperty("--himitsu-input-disabled-bg", increase_brightness_linear(base_bg_color, -2));
            css.setProperty("--himitsu-input-disabled-border", increase_brightness(base_bg_color, 4));
            css.setProperty("--himitsu-color", (base_text_color));
            css.setProperty("--himitsu-color-darken", increase_brightness_linear((base_text_color), -25));
            css.setProperty("--bs-body-color", (base_text_color));
            break;
    }
};
