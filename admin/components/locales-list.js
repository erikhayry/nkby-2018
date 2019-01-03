import Link from 'next/link'
import { List, Label, Icon } from 'semantic-ui-react'

const LocalesList = ({locales = []}) => {
    console.log(locales)

    return (
        <List>
            {locales.map(({id, name, pages, position}) => {
                return (
                    <List.Item>
                        <Link href={`/locale?id=${id}`}>
                            {name}
                        </Link>
                        <Label circular color="yellow">{pages.length}</Label>
                        <Label circular color={position ? 'green' : 'red'}>
                            <Icon name='marker' /> Position
                        </Label>
                    </List.Item>
                )

            })}
        </List>
    )
};

export default LocalesList;