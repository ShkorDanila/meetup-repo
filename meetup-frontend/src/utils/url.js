
export function isUrl(s) {
    if (!isUrl.rx_url) {
      isUrl.rx_url =
        /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
      isUrl.prefixes = ["http:\/\/", "https:\/\/", "ftp:\/\/", "www."];
      isUrl.domains = [
        "com",
        "ru",
        "net",
        "org",
        "de",
        "jp",
        "uk",
        "br",
        "pl",
        "in",
        "it",
        "fr",
        "au",
        "info",
        "nl",
        "ir",
        "cn",
        "es",
        "cz",
        "kr",
        "ua",
        "ca",
        "eu",
        "biz",
        "za",
        "gr",
        "co",
        "ro",
        "se",
        "tw",
        "mx",
        "vn",
        "tr",
        "ch",
        "hu",
        "at",
        "be",
        "dk",
        "tv",
        "me",
        "ar",
        "no",
        "us",
        "sk",
        "xyz",
        "fi",
        "id",
        "cl",
        "by",
        "nz",
        "il",
        "ie",
        "pt",
        "kz",
        "io",
        "my",
        "lt",
        "hk",
        "cc",
        "sg",
        "edu",
        "pk",
        "su",
        "bg",
        "th",
        "top",
        "lv",
        "hr",
        "pe",
        "club",
        "rs",
        "ae",
        "az",
        "si",
        "ph",
        "pro",
        "ng",
        "tk",
        "ee",
        "asia",
        "mobi",
      ];
    }

    if (!isUrl.rx_url.test(s)) return false;
    for (let i = 0; i < isUrl.prefixes.length; i++)
      if (s.startsWith(isUrl.prefixes[i])) return true;
    for (let i = 0; i < isUrl.domains.length; i++)
      if (
        s.endsWith("." + isUrl.domains[i]) ||
        s.includes("." + isUrl.domains[i] + "\/") ||
        s.includes("." + isUrl.domains[i] + "?")
      )
        return true;
  }