import { completeAttrHref, completeCssHref } from '@timecat/utils'

export function setAttribute(node: HTMLElement, name: string, value: string | boolean | null | object): void {
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return
    }
    if (name === 'style') {
        if (typeof value === 'string') {
            node.style.cssText = completeCssHref(value)
        } else if (value !== null && typeof value === 'object') {
            for (const [k, v] of Object.entries(value)) {
                if (k[0] === '-') {
                    node.style.setProperty(k, v as any)
                } else {
                    node.style[k as any] = v as any
                }
            }
        }
        return
    }

    // for disabled js prefetch
    if (value && typeof value === 'string' && /\.js$/.test(value)) {
        return
    }

    if (!/^[\w\-\d]+$/.test(name)) {
        return
    }

    if (/^on\w+$/.test(name)) {
        return
    }

    if (value === null) {
        return node.removeAttribute(name)
    }

    value = String(value)

    if (name === 'href') {
        value = completeAttrHref(String(value), node)
    }

    if (name === 'background' || name === 'src') {
        if (value.startsWith('data:')) {
            // skip
        } else {
            value = completeAttrHref(String(value), node)
        }
    }

    // The srcset attribute specifies the URL of the image to use in different situations
    if (name === 'srcset') {
        const srcArray = value.split(',')
        value = srcArray.map(src => completeAttrHref(src.trim(), node)).toString()
    }

    if (value.startsWith('/')) {
        value = completeAttrHref(value, node)
    }

    return node.setAttribute(name, value)
}
