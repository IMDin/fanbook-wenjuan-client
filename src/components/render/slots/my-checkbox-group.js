export default {
    options(h, conf, key, that) {
        const list = []
        conf.__slot__.options.forEach(item => {
            if (conf.__config__.optionType === 'button') {
                list.push(<my-checkbox-button label={item.value}>{item.label}</my-checkbox-button>)
            } else {
                if (item.value == 0) {
                    list.push(
                        <div style="display: flex;align-items: center;">
                            <my-checkbox label={item.value}
                                         border={conf.border}>{item.label}
                            </my-checkbox>
                            <input class="item-other-input"
                                   onInput={event => {
                                       console.log(event, 'eventssssssss')
                                       that.$emit('otherChange', event.target.value, conf)
                                   }}
                                   onChange={event => {
                                       that.$emit('otherChange', event.target.value, conf)
                                   }}/>
                        </div>
                    )
                } else {
                    list.push(<my-checkbox label={item.value} border={conf.border}>{item.label}</my-checkbox>)
                }
            }
        })
        return list
    }
}
