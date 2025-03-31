'use strict'

/**
 * Dream Translate
 * https://github.com/ryanker/dream_translate
 * @Author Ryan <dream39999@gmail.com>
 * @license MIT License
 */

function googleTranslate() {
	return {
		langMap: {
			"auto": "auto",
			"pl": "pl",
			"de": "de",
			"ru": "ru",
			"ht": "ht",
			"nl": "nl",
			"cs": "cs",
			"ro": "ro",
			"mg": "mg",
			"hmn": "hmn",
			"pt": "pt",
			"sm": "sm",
			"sk": "sk",
			"ceb": "ceb",
			"th": "th",
			"tr": "tr",
			"el": "el",
			"haw": "haw",
			"hu": "hu",
			"it": "it",
			"hi": "hi",
			"id": "id",
			"en": "en",
			"alb": "sq",
			"ara": "ar",
			"amh": "am",
			"aze": "az",
			"gle": "ga",
			"est": "et",
			"baq": "eu",
			"bel": "be",
			"bul": "bg",
			"ice": "is",
			"bos": "bs",
			"per": "fa",
			"tat": "tt",
			"dan": "da",
			"fra": "fr",
			"fil": "tl",
			"fin": "fi",
			"hkm": "km",
			"geo": "ka",
			"guj": "gu",
			"kaz": "kk",
			"kor": "ko",
			"hau": "ha",
			"kir": "ky",
			"glg": "gl",
			"cat": "ca",
			"kan": "kn",
			"cos": "co",
			"hrv": "hr",
			"kur": "ku",
			"lat": "la",
			"lav": "lv",
			"lao": "lo",
			"lit": "lt",
			"ltz": "lb",
			"kin": "rw",
			"mlt": "mt",
			"mar": "mr",
			"mal": "ml",
			"may": "ms",
			"mac": "mk",
			"mao": "mi",
			"ben": "bn",
			"bur": "my",
			"nep": "ne",
			"nor": "no",
			"pan": "pa",
			"pus": "ps",
			"nya": "ny",
			"jp": "ja",
			"swe": "sv",
			"sin": "si",
			"epo": "eo",
			"slo": "sl",
			"swa": "sw",
			"som": "so",
			"tgk": "tg",
			"tel": "te",
			"tam": "ta",
			"tuk": "tk",
			"wel": "cy",
			"urd": "ur",
			"ukr": "uk",
			"uzb": "uz",
			"spa": "es",
			"heb": "iw",
			"snd": "sd",
			"sna": "sn",
			"arm": "hy",
			"ibo": "ig",
			"yid": "yi",
			"yor": "yo",
			"vie": "vi",
			"afr": "af",
			"xho": "xh",
			"zul": "zu",
			"srp": "sr",
			"jav": "jw",
			"zh": "zh-CN",
			"fry": "fy",
			"sco": "gd",
			"sun": "su",
			"or": "or",
			"mn": "mn",
			"st": "st",
			"ug": "ug"
		},
		langMapInvert: {},

		init() {
			this.langMapInvert = invertObject(this.langMap)
			return this
		},

		unify(r, q, srcLan, tarLan) {
			// console.log('google:', r, q, srcLan, tarLan)

			// 翻译的语言参数
			if (srcLan === 'auto' && r.sourceLanguage) srcLan = r.sourceLanguage; // 源语言
			let map = this.langMapInvert
			srcLan = map[srcLan] || 'auto'
			tarLan = map[tarLan] || ''

			// 翻译结果
			let data = [];
			r.sentences && r.sentences.forEach(v => {
				if (v.trans && v.orig) data.push({srcText: v.orig, tarText: v.trans})
			})

			// 额外信息，如单词释义等
			let extra = '';
			if (!setting.translateThin && r.bilingualDictionary && isArray(r.bilingualDictionary)) {
				r.bilingualDictionary.forEach(v => {
					if (v.pos && v.entry) {
						let entryArr = [];
						if (isArray(v.entry) && v.entry.length > 0) {
							v.entry.map(v => {
								entryArr.push(v.word);
							});
						}
						if (entryArr.length > 0) {
							extra += `<p><b>${v.pos}</b>${entryArr.join('；')}</p>`
						}
					}
				})
				if (extra) extra = `<div class="case_dd"><div class="case_dd_parts">${extra}</div></div>`
			}

			return {
				text: q, // 需要翻译的原始文本
				srcLan: srcLan, // 源语言代码，如 en, zh-CN 等
				tarLan: tarLan, // 目标语言代码，如 en, zh-CN 等
				lanTTS: null,
				data: data, // 翻译结果，如 [{srcText: 'hello', tarText: '你好'}]
				extra: extra, // 额外信息，如单词释义等
			}
		},

		trans(q, srcLan, tarLan) {
			srcLan = this.langMap[srcLan] || 'auto'
			tarLan = this.langMap[tarLan] || 'zh-CN'
			return new Promise(async (resolve, reject) => {
				if (q.length > 1000) return reject('The text is too large!')

				// 翻译接口来源于，官方的 Google 翻译插件
				const url = `https://translate-pa.googleapis.com/v1/translate?params.client=gtx` +
					`&query.source_language=${srcLan}` +
					`&query.target_language=${tarLan}` +
					`&query.display_language=${tarLan}` +
					`&query.text=${encodeURIComponent(q)}` +
					'&key=AIzaSyDLEeFI5OtFBwYBIoK_jj5m32rZK5CkCXA' +
					'&data_types=TRANSLATION' +
					'&data_types=SENTENCE_SPLITS' +
					'&data_types=BILINGUAL_DICTIONARY_FULL';
				await httpGet(url, 'json').then(r => {
					if (r) {
						resolve(this.unify(r, q, srcLan, tarLan))
					} else {
						reject('google translate error!')
					}
				}).catch(function (e) {
					reject(e)
				})
			})
		},

		async query(q, srcLan, tarLan) {
			return checkRetry(() => this.trans(q, srcLan, tarLan), 2)
		},

		tts(q, lan) {
			lan = this.langMap[lan] || 'en'
			return new Promise(async (resolve, reject) => {
				try {
					const url = 'https://translate-pa.googleapis.com/v1/textToSpeech?client=gtx' +
						'&language=' + lan +
						'&text=' + encodeURIComponent(q) +
						'&voice_speed=1' +
						'&key=AIzaSyDLEeFI5OtFBwYBIoK_jj5m32rZK5CkCXA';
					let data = await httpGet(url, 'json');
					let blobUrl = this.base64ToBlobUrl(data.audioContent); // 将 Base64 编码的数据转换为 Blob 对象并创建一个指向该 Blob 的 URL
					resolve([blobUrl])
				} catch (e) {
					reject(e)
				}
			})
		},

		// 将 Base64 编码的数据转换为 Blob 对象并创建一个指向该 Blob 的 URL
		base64ToBlobUrl(base64Data) {
			const base64WithoutPrefix = base64Data.replace(/^data:.+;base64,/, '');
			const binaryData = atob(base64WithoutPrefix);
			const arrayBuffer = new ArrayBuffer(binaryData.length);
			const uint8Array = new Uint8Array(arrayBuffer);
			for (let i = 0; i < binaryData.length; i++) {
				uint8Array[i] = binaryData.charCodeAt(i);
			}
			const blob = new Blob([uint8Array], {type: 'audio/mp3'});
			return URL.createObjectURL(blob);
		},

		link(q, srcLan, tarLan) {
			srcLan = this.langMap[srcLan] || 'auto'
			tarLan = this.langMap[tarLan] || 'zh-CN'
			return `https://translate.google.com/?sl=${srcLan}&tl=${tarLan}&text=${encodeURIComponent(q)}&op=translate`
		},
	}
}
